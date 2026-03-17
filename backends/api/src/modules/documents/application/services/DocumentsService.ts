import { Injectable } from '@nestjs/common';
import { DocumentRepository } from '../../domain/repositories/DocumentRepository';
import { CreateDocumentDto } from '../dtos/CreateDocumentDto';
import { DocumentEntity } from '../../domain/entities/DocumentEntity';
import { DocumentStatusEnum } from '../../domain/enums/DocumentStatusEnum';

@Injectable()
export class DocumentsService {
  constructor(private readonly documentRepository: DocumentRepository) {}
  async create(dto: CreateDocumentDto): Promise<DocumentEntity> {
    const document = new DocumentEntity();
    document.title = dto.title;
    document.tenantId = dto.tenantId;
    document.sourceType = dto.sourceType ?? 'upload';
    document.status = DocumentStatusEnum.PENDING;
    return this.documentRepository.save(document);
  }
  async findBYTenantId(tenantId: string): Promise<DocumentEntity[]> {
    return this.documentRepository.findByTenantId(tenantId);
  }
}
