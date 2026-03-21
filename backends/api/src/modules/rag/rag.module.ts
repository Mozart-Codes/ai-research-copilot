import { Module } from '@nestjs/common';
import { RagService } from './application/services/RagService';
import { RagController } from './application/controllers/RagController';
import { IngestionModule } from '../ingestion/ingestion.module';

@Module({
  imports: [IngestionModule],
  controllers: [RagController],
  providers: [RagService],
  exports: [RagService],
})
export class RagModule {}
