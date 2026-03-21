import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

interface SimilarChunkResult {
  chunk_id: string;
  score: number;
}

@Injectable()
export class EmbeddingRepository {
  private readonly logger = new Logger(EmbeddingRepository.name);

  constructor(private readonly dataSource: DataSource) {}

  async saveEmbedding(
    chunkId: string,
    tenantId: string,
    embedding: number[],
    modelVersion: string,
  ): Promise<void> {
    await this.dataSource.query(
      `INSERT INTO embeddings (chunk_id, tenant_id, embedding, model_version)
       VALUES ($1, $2, $3::vector, $4)`,
      [chunkId, tenantId, JSON.stringify(embedding), modelVersion],
    );
    this.logger.log(`Saved embedding for chunk ${chunkId}`);
  }

  async findSimilarChunks(
    tenantId: string,
    queryEmbedding: number[],
    limit: number = 5,
  ): Promise<{ chunkId: string; score: number }[]> {
    const results = await this.dataSource.query<SimilarChunkResult[]>(
      `SELECT chunk_id, 1 - (embedding <=> $1::vector) AS score
       FROM embeddings
       WHERE tenant_id = $2
       ORDER BY embedding <=> $1::vector
       LIMIT $3`,
      [JSON.stringify(queryEmbedding), tenantId, limit],
    );

    return results.map((r) => ({
      chunkId: r.chunk_id,
      score: r.score,
    }));
  }
}
