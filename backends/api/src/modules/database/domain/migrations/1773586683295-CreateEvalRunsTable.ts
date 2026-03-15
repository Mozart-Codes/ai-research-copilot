import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEvalRunsTable1773586683295 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE eval_runs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id),
      query TEXT NOT NULL,
      answer TEXT,
      faithfulness_score DECIMAL(4,3),
      relevance_score DECIMAL(4,3),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE eval_runs`);
  }
}
