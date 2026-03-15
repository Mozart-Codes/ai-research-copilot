import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDocumentChunksTable1773586500517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE document_chunks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
      tenant_id UUID NOT NULL REFERENCES tenants(id),
      content TEXT NOT NULL,
      chunk_index INTEGER NOT NULL,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE document_chunks`);
  }
}
