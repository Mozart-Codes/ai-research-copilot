import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  tenantId!: string;

  @IsString()
  @IsOptional()
  sourceType?: string;
}
