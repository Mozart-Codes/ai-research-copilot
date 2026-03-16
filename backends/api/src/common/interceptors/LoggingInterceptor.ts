import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const requestPayloadSize = req?.body ? JSON.stringify(req.body).length : 0;
    const method = req.method;
    const path = req.url;
    const now = Date.now();

    return next.handle().pipe(
      map((data: unknown) => {
        const duration = Date.now() - now;
        const status = res.statusCode;
        const responsePayloadSize = data ? JSON.stringify(data).length : 0;

        this.logger.log(
          `${method} ${path} | status: ${status} | duration: ${duration}ms | payload: ${requestPayloadSize + responsePayloadSize}b`,
        );

        return data;
      }),
    );
  }
}
