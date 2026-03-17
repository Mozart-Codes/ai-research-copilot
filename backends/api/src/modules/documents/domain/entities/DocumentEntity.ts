import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { DocumentStatusEnum } from '../enums/DocumentStatusEnum';

@Entity({ name: 'documents' })
export class DocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'tenant_id',
    type: 'uuid',
    nullable: false,
  })
  tenantId: string;

  @Column({
    name: 'title',
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  title: string;

  @Column({
    name: 'source_type',
    type: 'varchar',
    length: 50,
    nullable: false,
    default: 'upload',
  })
  sourceType: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: DocumentStatusEnum,
    default: DocumentStatusEnum.PENDING,
    nullable: false,
  })
  status: DocumentStatusEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
