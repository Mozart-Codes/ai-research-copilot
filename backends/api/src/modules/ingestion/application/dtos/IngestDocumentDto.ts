import { IsString, MinLength } from 'class-validator';

export class IngestDocumentDto {
  @IsString()
  documentId!: string;

  @IsString()
  tenantId!: string;

  @IsString()
  @MinLength(10)
  content!: string;
}
