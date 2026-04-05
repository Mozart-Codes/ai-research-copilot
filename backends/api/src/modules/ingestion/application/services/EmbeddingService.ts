import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import OpenAI from 'openai';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly openai: OpenAI;
  private readonly model = 'text-embedding-3-small';

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('app.openaiApiKey'),
    });
  }

  private getEmbeddingCacheKey(text: string): string {
    const hash = createHash('sha256').update(text).digest('hex');
    return `emb:${this.model}:${hash}`;
  }

  async embedText(text: string): Promise<number[]> {
    const cacheKey = this.getEmbeddingCacheKey(text);
    const cached = await this.cacheManager.get<number[]>(cacheKey);

    if (cached) {
      this.logger.log(`Cache hit for query embedding`);
      return cached;
    }

    const response = await this.openai.embeddings.create({
      model: this.model,
      input: text,
    });

    const embedding = response.data[0].embedding;
    await this.cacheManager.set(cacheKey, embedding);
    this.logger.log(
      `Generated embedding — tokens used: ${response.usage.total_tokens}`,
    );
    return embedding;
  }

  async embedMany(texts: string[]): Promise<number[][]> {
    // Step 1 — compute cache keys for all texts
    const cacheKeys = texts.map((t) => this.getEmbeddingCacheKey(t));

    // Step 2 — check cache for all keys in parallel
    const cachedResults = await Promise.all(
      cacheKeys.map((key) => this.cacheManager.get<number[]>(key)),
    );

    // Step 3 — find which indices are misses
    const missIndices: number[] = [];
    cachedResults.forEach((result, i) => {
      if (!result) missIndices.push(i);
    });

    this.logger.log(
      `Embedding cache — hits: ${texts.length - missIndices.length}, misses: ${missIndices.length}`,
    );

    // Step 4 — call OpenAI only for misses
    if (missIndices.length > 0) {
      const missTexts = missIndices.map((i) => texts[i]);
      const response = await this.openai.embeddings.create({
        model: this.model,
        input: missTexts,
      });
      this.logger.log(
        `Generated ${missIndices.length} embeddings — tokens used: ${response.usage.total_tokens}`,
      );

      // Step 5 — write misses to cache and slot back into results at original index
      await Promise.all(
        missIndices.map(async (originalIndex, responseIndex) => {
          const embedding = response.data[responseIndex].embedding;
          cachedResults[originalIndex] = embedding;
          await this.cacheManager.set(cacheKeys[originalIndex], embedding);
        }),
      );
    }

    // Step 6 — return in original order
    return cachedResults as number[][];
  }
}
