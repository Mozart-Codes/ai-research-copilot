import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateErrorLogsTable1773586718456 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE error_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID,
      message TEXT NOT NULL,
      stack TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE error_logs`);
  }
}
