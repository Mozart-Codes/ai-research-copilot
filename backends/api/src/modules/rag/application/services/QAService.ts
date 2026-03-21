import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import OpenAI from 'openai';
import { RagService } from './RagService';

export interface QAResult {
  answer: string;
  sources: {
    chunkId: string;
    documentId: string;
    score: number;
  }[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

@Injectable()
export class QAService {
  private readonly logger = new Logger(QAService.name);
  private readonly openai: OpenAI;

  constructor(
    private readonly ragService: RagService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('app.openaiApiKey'),
    });
  }

  async ask(question: string, tenantId: string): Promise<QAResult> {
    this.logger.log(`Question: "${question}" from tenant ${tenantId}`);

    // Step 1 — retrieve relevant chunks
    const searchResults = await this.ragService.search(question, tenantId, 5);

    if (searchResults.length === 0) {
      return {
        answer: 'I could not find any relevant information in your documents.',
        sources: [],
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      };
    }

    // Step 2 — assemble context from chunks
    const context = searchResults
      .map((r, i) => `[Source ${i + 1}]: ${r.content}`)
      .join('\n\n');

    // Step 3 — call LLM
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant. Answer the question based ONLY on the provided context. 
If the answer is not in the context, say "I don't have enough information to answer that."
Always be concise and accurate.`,
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}`,
        },
      ],
      temperature: 0.1,
    });

    const answer = response.choices[0].message.content ?? '';
    const usage = response.usage;

    this.logger.log(
      `Answer generated — tokens used: ${usage?.total_tokens ?? 0}`,
    );

    // Step 4 — save conversation to DB
    await this.dataSource.query(
      `INSERT INTO conversations (tenant_id, messages)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [
        tenantId,
        JSON.stringify([
          { role: 'user', content: question },
          { role: 'assistant', content: answer },
        ]),
      ],
    );

    return {
      answer,
      sources: searchResults.map((r) => ({
        chunkId: r.chunkId,
        documentId: r.documentId,
        score: r.score,
      })),
      usage: {
        promptTokens: usage?.prompt_tokens ?? 0,
        completionTokens: usage?.completion_tokens ?? 0,
        totalTokens: usage?.total_tokens ?? 0,
      },
    };
  }
}
