import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ChunkingService } from './ChunkingService';
import { EmbeddingService } from './EmbeddingService';
import { DocumentChunkRepository } from '../../domain/repositories/DocumentChunkRepository';
import { EmbeddingRepository } from '../../domain/repositories/EmbeddingRepository';
import { DocumentChunkEntity } from '../../domain/entities/DocumentChunkEntity';
import { DocumentsService } from '../../../documents/application/services/DocumentsService';
import { DocumentStatusEnum } from '../../../documents/domain/enums/DocumentStatusEnum';

export interface IngestResult {
  documentId: string;
  totalChunks: number;
  status: string;
}

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private readonly chunkingService: ChunkingService,
    private readonly embeddingService: EmbeddingService,
    private readonly documentChunkRepository: DocumentChunkRepository,
    private readonly embeddingRepository: EmbeddingRepository,
    private readonly dataSource: DataSource,
    private readonly documentsService: DocumentsService,
  ) {}

  async ingest(
    documentId: string,
    tenantId: string,
    content: string,
  ): Promise<IngestResult> {
    this.logger.log(`Starting ingestion for document ${documentId}`);

    try {
      // Mark as processing
      await this.documentsService.updateStatus(
        documentId,
        DocumentStatusEnum.PROCESSING,
      );

      // Step 1 — chunk the text (outside transaction — no DB operations)
      const chunkTexts = await this.chunkingService.chunkText(content);

      // Step 2 — generate ALL embeddings first (before any DB writes)
      const embeddings = await this.embeddingService.embedMany(chunkTexts);

      // Step 3 — save everything in a single transaction
      await this.dataSource.transaction(async (manager) => {
        const chunkEntities = chunkTexts.map((text, index) => {
          const chunk = new DocumentChunkEntity();
          chunk.documentId = documentId;
          chunk.tenantId = tenantId;
          chunk.content = text;
          chunk.chunkIndex = index;
          chunk.metadata = {};
          return chunk;
        });

        const savedChunks = await manager.save(
          DocumentChunkEntity,
          chunkEntities,
        );

        for (let i = 0; i < savedChunks.length; i++) {
          await manager.query(
            `INSERT INTO embeddings (chunk_id, tenant_id, embedding, model_version)
             VALUES ($1, $2, $3::vector, $4)`,
            [
              savedChunks[i].id,
              tenantId,
              JSON.stringify(embeddings[i]),
              'text-embedding-3-small',
            ],
          );
        }
      });

      // Mark as completed
      await this.documentsService.updateStatus(
        documentId,
        DocumentStatusEnum.COMPLETED,
      );

      this.logger.log(
        `Ingestion complete for document ${documentId} — ${chunkTexts.length} chunks`,
      );

      return {
        documentId,
        totalChunks: chunkTexts.length,
        status: 'completed',
      };
    } catch (error) {
      // Compensation logic — mark as failed before rethrowing
      await this.documentsService.updateStatus(
        documentId,
        DocumentStatusEnum.FAILED,
      );
      this.logger.error(`Ingestion failed for document ${documentId}`, error);
      throw error;
    }
  }
}
