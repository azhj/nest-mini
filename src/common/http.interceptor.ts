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
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    // 前置逻辑：在 Controller 处理请求之前
    // 例如：记录请求开始时间、添加请求ID等
    this.logger.log(`[${method}] ${url} - 请求开始`);

    // next.handle() 返回 Observable，必须调用
    // tap() 执行后置逻辑（在响应返回之前）
    return next.handle().pipe(
      tap({
        next: () => {
          // 请求成功完成后的逻辑
          const elapsed = Date.now() - now;
          this.logger.log(`[${method}] ${url} - ${elapsed}ms - 成功`);
        },
        error: (error) => {
          // 请求出错时的逻辑（注意：这里捕获不到，因为异常会被异常过滤器处理）
          const elapsed = Date.now() - now;
          this.logger.warn(`[${method}] ${url} - ${elapsed}ms - 失败`);
        },
      }),
    );
  }
}
