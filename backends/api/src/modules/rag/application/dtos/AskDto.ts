import { IsString, IsOptional } from 'class-validator';

export class AskDto {
  @IsString()
  question: string;

  @IsString()
  tenantId: string;

  @IsOptional()
  @IsString()
  conversationId?: string;
}
