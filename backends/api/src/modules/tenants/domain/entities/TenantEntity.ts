import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'tenants' })
export class TenantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'api_key_hash',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  apiKeyHash: string;

  @Column({
    name: 'token_budget_monthly',
    type: 'int',
    nullable: false,
    default: 1000000,
  })
  tokenBudgetMonthly: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
