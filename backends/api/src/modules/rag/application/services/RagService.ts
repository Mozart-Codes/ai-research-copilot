import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EmbeddingService } from '../../../ingestion/application/services/EmbeddingService';

interface SearchQueryResult {
  chunk_id: string;
  document_id: string;
  content: string;
  score: number;
}

export interface SearchResult {
  chunkId: string;
  documentId: string;
  content: string;
  score: number;
}

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);

  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly dataSource: DataSource,
  ) {}

  async search(
    query: string,
    tenantId: string,
    limit: number = 5,
  ): Promise<SearchResult[]> {
    this.logger.log(`Searching for: "${query}" in tenant ${tenantId}`);

    // Step 1 — embed the query
    const queryEmbedding = await this.embeddingService.embedText(query);

    // Step 2 — vector similarity search
    const results: SearchQueryResult[] = await this.dataSource.query(
      `SELECT
        e.chunk_id,
        dc.document_id,
        dc.content,
        1 - (e.embedding <=> $1::vector) AS score
       FROM embeddings e
       JOIN document_chunks dc ON dc.id = e.chunk_id
       WHERE e.tenant_id = $2
       ORDER BY e.embedding <=> $1::vector
       LIMIT $3`,
      [JSON.stringify(queryEmbedding), tenantId, limit],
    );

    this.logger.log(`Found ${results.length} results`);

    return results.map((r) => ({
      chunkId: r.chunk_id,
      documentId: r.document_id,
      content: r.content,
      score: Number(r.score),
    }));
  }
}
