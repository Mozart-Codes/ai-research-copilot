import { Controller, Post, Get, Body } from '@nestjs/common';
import { TenantsService } from '../services/TenantsService';
import { CreateTenantDto } from '../dtos/CreateTenantDto';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  create(@Body() dto: CreateTenantDto) {
    return this.tenantsService.create(dto);
  }

  @Get()
  findAll() {
    return this.tenantsService.findAll();
  }
}
