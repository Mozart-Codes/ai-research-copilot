import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { TenantEntity } from '../../domain/entities/TenantEntity';
import { TenantRepository } from '../../domain/repositories/TenantRepository';
import { CreateTenantDto } from '../dtos/CreateTenantDto';

export interface CreateTenantResult {
  tenant: TenantEntity;
  apiKey: string;
}

@Injectable()
export class TenantsService {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async create(dto: CreateTenantDto): Promise<CreateTenantResult> {
    const apiKey = crypto.randomBytes(32).toString('hex');
    const apiKeyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

    const tenant = new TenantEntity();
    tenant.name = dto.name;
    tenant.apiKeyHash = apiKeyHash;

    const saved = await this.tenantRepository.save(tenant);
    return { tenant: saved, apiKey };
  }

  async findAll(): Promise<TenantEntity[]> {
    return this.tenantRepository.findAll();
  }
}
