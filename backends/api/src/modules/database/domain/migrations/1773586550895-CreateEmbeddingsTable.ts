import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmbeddingsTable1773586550895 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);
    await queryRunner.query(`
    CREATE TABLE embeddings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      chunk_id UUID NOT NULL REFERENCES document_chunks(id) ON DELETE CASCADE,
      tenant_id UUID NOT NULL REFERENCES tenants(id),
      embedding vector(1536),
      model_version VARCHAR(100) DEFAULT 'text-embedding-3-small',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
    await queryRunner.query(`
    CREATE INDEX ON embeddings USING hnsw (embedding vector_cosine_ops)
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE embeddings`);
  }
}
