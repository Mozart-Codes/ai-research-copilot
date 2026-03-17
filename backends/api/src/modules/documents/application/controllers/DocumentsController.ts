import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { DocumentsService } from '../services/DocumentsService';
import { CreateDocumentDto } from '../dtos/CreateDocumentDto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentService: DocumentsService) {}

  @Post()
  create(@Body() dto: CreateDocumentDto) {
    return this.documentService.create(dto);
  }

  @Get(':tenantId')
  findByTenantId(@Param('tenantId') tenantId: string) {
    console.log(`tenantId received: ${tenantId}`);
    return this.documentService.findBYTenantId(tenantId);
  }
}
