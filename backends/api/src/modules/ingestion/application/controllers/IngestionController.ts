import { Controller, Post, Body } from '@nestjs/common';
import { IngestionService } from '../services/IngestionService';
import { IngestDocumentDto } from '../dtos/IngestDocumentDto';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('ingest')
  ingest(@Body() dto: IngestDocumentDto) {
    return this.ingestionService.ingest(
      dto.documentId,
      dto.tenantId,
      dto.content,
    );
  }
}
