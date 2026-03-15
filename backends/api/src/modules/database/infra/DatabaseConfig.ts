import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

const rootFolder = path.resolve(__dirname, '../../../');
const env = process.env.ENVIRONMENT ?? 'development';
const envPath = path.resolve(rootFolder, '..', 'config', `.env.${env}`);

console.log(`ENV: ${env}`);
dotenv.config({ path: envPath });

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST!,
  port: parseInt(process.env.DATABASE_PORT!),
  username: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  synchronize: false,
  migrations: [
    path.resolve(
      rootFolder,
      'modules',
      'database',
      'domain',
      'migrations',
      '*{.ts,.js}',
    ),
  ],
});
