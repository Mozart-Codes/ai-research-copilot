import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

const RATE_LIMIT = 20; // max requests
const WINDOW_SECONDS = 60; // per minute

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ body: { tenantId?: string } }>();
    const tenantId = request.body?.tenantId;

    if (!tenantId) {
      throw new HttpException('tenantId is required', HttpStatus.BAD_REQUEST);
    }

    const minute = Math.floor(Date.now() / 1000 / WINDOW_SECONDS);
    const key = `rate_limit:${tenantId}:${minute}`;

    const current = (await this.cache.get<number>(key)) ?? 0;

    if (current >= RATE_LIMIT) {
      this.logger.warn(`Rate limit exceeded for tenant ${tenantId}`);
      throw new HttpException(
        `Rate limit exceeded — max ${RATE_LIMIT} requests per minute`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.cache.set(key, current + 1, WINDOW_SECONDS * 1000);

    return true;
  }
}
