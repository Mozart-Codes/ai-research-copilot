import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentChunkEntity } from './domain/entities/DocumentChunkEntity';
import { EmbeddingEntity } from './domain/entities/EmbeddingEntity';
import { DocumentChunkRepository } from './domain/repositories/DocumentChunkRepository';
import { EmbeddingRepository } from './domain/repositories/EmbeddingRepository';
import { ChunkingService } from './application/services/ChunkingService';
import { EmbeddingService } from './application/services/EmbeddingService';
import { IngestionService } from './application/services/IngestionService';
import { IngestionController } from './application/controllers/IngestionController';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentChunkEntity, EmbeddingEntity]),
    DocumentsModule,
  ],
  controllers: [IngestionController],
  providers: [
    DocumentChunkRepository,
    EmbeddingRepository,
    ChunkingService,
    EmbeddingService,
    IngestionService,
  ],
  exports: [IngestionService, EmbeddingService],
})
export class IngestionModule {}
