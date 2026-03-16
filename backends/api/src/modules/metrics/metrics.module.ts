import { Module } from '@nestjs/common';
import { MetricsController } from './application/controllers/MetricsController';

@Module({
  controllers: [MetricsController],
})
export class MetricsModule {}
