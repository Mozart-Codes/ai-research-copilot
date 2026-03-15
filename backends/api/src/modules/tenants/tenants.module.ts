import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantEntity } from './domain/entities/TenantEntity';
import { TenantRepository } from './domain/repositories/TenantRepository';
import { TenantsService } from './application/services/TenantsService';
import { TenantsController } from './application/controllers/TenantsController';

@Module({
  imports: [TypeOrmModule.forFeature([TenantEntity])],
  controllers: [TenantsController],
  providers: [TenantRepository, TenantsService],
  exports: [TenantsService],
})
export class TenantsModule {}
