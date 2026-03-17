import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DocumentEntity } from '../entities/DocumentEntity';
import { DocumentStatusEnum } from '../enums/DocumentStatusEnum';

@Injectable()
export class DocumentRepository {
  private get repo(): Repository<DocumentEntity> {
    return this.dataSource.getRepository(DocumentEntity);
  }

  constructor(private readonly dataSource: DataSource) {}

  async save(document: DocumentEntity): Promise<DocumentEntity> {
    return this.repo.save(document);
  }

  async findByTenantId(tenantId: string): Promise<DocumentEntity[]> {
    return this.repo
      .createQueryBuilder('document')
      .where('document.tenant_id = :tenantId', { tenantId })
      .getMany();
  }

  async findByIdAndTenantId(
    id: string,
    tenantId: string,
  ): Promise<DocumentEntity | null> {
    return this.repo
      .createQueryBuilder('document')
      .where('document.id = :id', { id })
      .andWhere('document.tenant_id = :tenantId', { tenantId })
      .getOne();
  }

  async updateStatus(id: string, status: DocumentStatusEnum): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .update(DocumentEntity)
      .set({ status })
      .where('id = :id', { id })
      .execute();
  }
}
