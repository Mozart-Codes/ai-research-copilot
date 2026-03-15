import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

const env = process.env.ENVIRONMENT ?? 'development';
const envPath = path.resolve(__dirname, '../../config', `.env.${env}`);
dotenv.config({ path: envPath });

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST ?? '',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  name: process.env.DATABASE_NAME ?? '',
  user: process.env.DATABASE_USER ?? '',
  password: process.env.DATABASE_PASSWORD ?? '',
}));
