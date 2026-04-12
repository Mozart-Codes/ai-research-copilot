import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { IngestionService } from '../services/IngestionService';
import { FileParsingUtil } from '../utils/FileParsingUtil';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('ingest')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async ingest(
    @Body('documentId') documentId: string,
    @Body('tenantId') tenantId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (!documentId || !tenantId) {
      throw new BadRequestException('documentId and tenantId are required');
    }

    const content = FileParsingUtil.extractText(file);

    return this.ingestionService.ingest(documentId, tenantId, content);
  }
}
