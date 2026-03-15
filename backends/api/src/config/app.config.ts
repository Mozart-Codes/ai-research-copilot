import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

const env = process.env.ENVIRONMENT ?? 'development';
const envPath = path.resolve(__dirname, '../../config', `.env.${env}`);
dotenv.config({ path: envPath });

export default registerAs('app', () => ({
  openaiApiKey: process.env.OPENAI_API_KEY ?? '',
  redisHost: process.env.REDIS_HOST ?? 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT ?? '6379', 10),
}));
