import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DocumentChunkEntity } from '../entities/DocumentChunkEntity';

@Injectable()
export class DocumentChunkRepository {
  private get repo(): Repository<DocumentChunkEntity> {
    return this.dataSource.getRepository(DocumentChunkEntity);
  }

  constructor(private readonly dataSource: DataSource) {}

  async saveMany(
    chunks: DocumentChunkEntity[],
  ): Promise<DocumentChunkEntity[]> {
    return this.repo.save(chunks);
  }

  async findByDocumentId(documentId: string): Promise<DocumentChunkEntity[]> {
    return this.repo
      .createQueryBuilder('chunk')
      .where('chunk.document_id = :documentId', { documentId })
      .orderBy('chunk.chunk_index', 'ASC')
      .getMany();
  }
}
