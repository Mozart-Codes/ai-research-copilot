import { Controller, Post, Body } from '@nestjs/common';
import { RagService } from '../services/RagService';
import { QAService } from '../services/QAService';
import { SearchDto } from '../dtos/SearchDto';
import { AskDto } from '../dtos/AskDto';

@Controller('rag')
export class RagController {
  constructor(
    private readonly ragService: RagService,
    private readonly qaService: QAService,
  ) {}

  @Post('search')
  search(@Body() dto: SearchDto) {
    return this.ragService.search(dto.query, dto.tenantId, dto.limit ?? 5);
  }

  @Post('ask')
  ask(@Body() dto: AskDto) {
    return this.qaService.ask(dto.question, dto.tenantId);
  }
}
