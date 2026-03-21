import { Injectable, Logger } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

@Injectable()
export class ChunkingService {
  private readonly logger = new Logger(ChunkingService.name);

  private readonly splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  async chunkText(text: string): Promise<string[]> {
    const chunks = await this.splitter.splitText(text);
    this.logger.log(`Split text into ${chunks.length} chunks`);
    return chunks;
  }
}
