import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import * as Joi from 'joi';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { TenantsModule } from './modules/tenants/tenants.module';
import { HealthModule } from './modules/health/health.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { IngestionModule } from './modules/ingestion/ingestion.module';
import { RagModule } from './modules/rag/rag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: `config/.env.${process.env.ENVIRONMENT ?? 'development'}`,
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().default(5432),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        OPENAI_API_KEY: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().default(6379),
      }),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        stores: [
          new KeyvRedis(
            `redis://${configService.get<string>('app.redisHost')}:${configService.get<number>('app.redisPort')}`,
          ),
        ],
        ttl: 0,
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get<number>('database.port'),
        database: config.get('database.name'),
        username: config.get('database.user'),
        password: config.get('database.password'),
        synchronize: false,
        logging: true,
        entities: [__dirname + '/**/*Entity.ts', __dirname + '/**/*Entity.js'],
      }),
    }),
    TenantsModule,
    HealthModule,
    MetricsModule,
    DocumentsModule,
    IngestionModule,
    RagModule,
  ],
})
export class AppModule {}
