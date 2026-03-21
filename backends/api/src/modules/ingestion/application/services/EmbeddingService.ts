import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly openai: OpenAI;
  private readonly model = 'text-embedding-3-small';

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('app.openaiApiKey'),
    });
  }

  async embedText(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: this.model,
      input: text,
    });

    const embedding = response.data[0].embedding;
    this.logger.log(
      `Generated embedding — tokens used: ${response.usage.total_tokens}`,
    );
    return embedding;
  }

  async embedMany(texts: string[]): Promise<number[][]> {
    const response = await this.openai.embeddings.create({
      model: this.model,
      input: texts,
    });

    this.logger.log(
      `Generated ${texts.length} embeddings — tokens used: ${response.usage.total_tokens}`,
    );
    return response.data.map((d) => d.embedding);
  }
}
