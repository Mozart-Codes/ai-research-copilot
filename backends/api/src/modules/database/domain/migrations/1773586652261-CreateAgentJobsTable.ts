import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAgentJobsTable1773586652261 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE agent_jobs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id),
      status VARCHAR(50) DEFAULT 'pending',
      input TEXT,
      result TEXT,
      tool_calls JSONB DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE agent_jobs`);
  }
}
