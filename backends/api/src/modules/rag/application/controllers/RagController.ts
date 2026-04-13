import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RagService } from '../services/RagService';
import { QAService } from '../services/QAService';
import { SearchDto } from '../dtos/SearchDto';
import { AskDto } from '../dtos/AskDto';
import { RateLimitGuard } from '../../../../common/guards/RateLimitGuard';

@Controller('rag')
export class RagController {
  constructor(
    private readonly ragService: RagService,
    private readonly qaService: QAService,
  ) {}

  @Post('search')
  @UseGuards(RateLimitGuard)
  search(@Body() dto: SearchDto) {
    return this.ragService.search(dto.query, dto.tenantId, dto.limit ?? 5);
  }

  @Post('ask')
  @UseGuards(RateLimitGuard)
  ask(@Body() dto: AskDto) {
    return this.qaService.ask(dto.question, dto.tenantId);
  }
}
