import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './application/controllers/DocumentsController';
import { DocumentRepository } from './domain/repositories/DocumentRepository';
import { DocumentsService } from './application/services/DocumentsService';
import { DocumentEntity } from './domain/entities/DocumentEntity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentEntity])],
  controllers: [DocumentsController],
  providers: [DocumentRepository, DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
