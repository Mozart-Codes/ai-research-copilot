import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTenantsTable1773574137078 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE tenants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        api_key_hash VARCHAR(255) UNIQUE NOT NULL,
        token_budget_monthly INTEGER DEFAULT 1000000,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE tenants`);
  }
}
