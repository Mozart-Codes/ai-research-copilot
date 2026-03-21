import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'embeddings' })
export class EmbeddingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'chunk_id', type: 'uuid', nullable: false })
  chunkId: string;

  @Column({ name: 'tenant_id', type: 'uuid', nullable: false })
  tenantId: string;

  @Column({
    name: 'model_version',
    type: 'varchar',
    length: 100,
    nullable: false,
    default: 'text-embedding-3-small',
  })
  modelVersion: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
