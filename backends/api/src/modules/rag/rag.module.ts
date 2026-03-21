import { Module } from '@nestjs/common';
import { RagService } from './application/services/RagService';
import { QAService } from './application/services/QAService';
import { RagController } from './application/controllers/RagController';
import { IngestionModule } from '../ingestion/ingestion.module';

@Module({
  imports: [IngestionModule],
  controllers: [RagController],
  providers: [RagService, QAService],
  exports: [RagService, QAService],
})
export class RagModule {}
