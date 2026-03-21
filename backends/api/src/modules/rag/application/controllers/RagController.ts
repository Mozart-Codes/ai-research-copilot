import { Controller, Post, Body } from '@nestjs/common';
import { RagService } from '../services/RagService';
import { SearchDto } from '../dtos/SearchDto';

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('search')
  search(@Body() dto: SearchDto) {
    return this.ragService.search(dto.query, dto.tenantId, dto.limit ?? 5);
  }
}
