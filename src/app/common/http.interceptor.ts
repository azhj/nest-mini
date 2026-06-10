/**
 * ============================================================
 * HTTP 响应拦截器（HttpInterceptor）
 * ============================================================
 *
 * 职责：拦截所有成功响应，统一包装为 { code, message, data } 格式
 *
 * 拦截器执行顺序（洋葱模型）：
 *   请求 → Guard → Pipe → INTERCEPTOR(前) → Controller → Service
 *                                               ↓
 *                              INTERCEPTOR(后) ← 返回 ←
 *                                               ↓
 *   响应 ← ... ← INTERCEPTOR(后) ← ...
 *
 * 什么时候用拦截器？
 * 1. 统一响应格式（{ code, message, data }）
 * 2. 记录请求日志
 * 3. 添加通用头部（如 X-Request-Id）
 * 4. 缓存处理
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { Request } from 'express';

/** 将 Date 对象格式化为指定格式字符串 */
function formatDate(value: unknown): unknown {
  if (value instanceof Date) {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
  }
  if (Array.isArray(value)) {
    return value.map((item) => formatDate(item));
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value)) {
      result[key] = formatDate((value as Record<string, unknown>)[key]);
    }
    return result;
  }
  return value;
}

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest<
        Request & { user?: { id: number; username: string; role: string } }
      >();
    const { method, url } = request;
    const now = Date.now();

    this.logger.log(`[${method}] ${url} - 请求开始`);

    return next.handle().pipe(
      tap({
        next: () => {
          const elapsed = Date.now() - now;
          this.logger.log(`[${method}] ${url} - ${elapsed}ms - 成功`);
        },
        error: () => {
          const elapsed = Date.now() - now;
          this.logger.warn(`[${method}] ${url} - ${elapsed}ms - 失败`);
        },
      }),
      map((data) => {
        return formatDate(data);
      }),
    );
  }
}
