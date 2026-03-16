import { Controller, Get } from '@nestjs/common';

@Controller('metrics')
export class MetricsController {
  @Get()
  getMetrics(): string {
    return 'Prometheus metrics would be here later on ';
  }
}
