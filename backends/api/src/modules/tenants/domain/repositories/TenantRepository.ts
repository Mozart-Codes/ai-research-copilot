import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TenantEntity } from '../entities/TenantEntity';

@Injectable()
export class TenantRepository {
  private get repo(): Repository<TenantEntity> {
    return this.dataSource.getRepository(TenantEntity);
  }

  constructor(private readonly dataSource: DataSource) {}

  async save(tenant: TenantEntity): Promise<TenantEntity> {
    return this.repo.save(tenant);
  }

  async findAll(): Promise<TenantEntity[]> {
    return this.repo.createQueryBuilder('tenant').getMany();
  }

  async findByApiKeyHash(apiKeyHash: string): Promise<TenantEntity | null> {
    return this.repo
      .createQueryBuilder('tenant')
      .where('tenant.api_key_hash = :apiKeyHash', { apiKeyHash })
      .getOne();
  }
}
