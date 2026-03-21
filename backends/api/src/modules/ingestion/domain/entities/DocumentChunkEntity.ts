import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'document_chunks' })
export class DocumentChunkEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'document_id', type: 'uuid', nullable: false })
  documentId: string;

  @Column({ name: 'tenant_id', type: 'uuid', nullable: false })
  tenantId: string;

  @Column({ name: 'content', type: 'text', nullable: false })
  content: string;

  @Column({ name: 'chunk_index', type: 'int', nullable: false })
  chunkIndex: number;

  @Column({ name: 'metadata', type: 'jsonb', nullable: false, default: '{}' })
  metadata: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
