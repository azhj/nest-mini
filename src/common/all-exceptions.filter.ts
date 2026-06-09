/**
 * ============================================================
 * 统一异常过滤器（AllExceptionsFilter）
 * ============================================================
 *
 * 职责：捕获所有未被处理的异常，统一返回格式
 *
 * 异常处理流程：
 *   请求 → 守卫 → 管道 → Controller → Service → 抛出异常
 *       ↑                                                ↓
 *       └────────── 异常过滤器 ←───────── 全局捕获 ←──────┘
 *
 * 为什么需要？
 * 1. NestJS 内置异常返回格式不统一（有的返回字符串，有的返回对象）
 * 2. 前端需要一个统一的错误响应格式
 * 3. 可以记录日志、过滤敏感信息等
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch() // @Catch() 不带参数 = 捕获所有异常
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    // 1. 获取响应对象
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 2. 判断异常类型
    //    - HttpException：NestJS 内置异常（400/401/403/404/500 等）
    //    - 其他：未知异常（代码 bug、外部服务错误等）
    let status: number;
    let message: string | object;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // 处理不同格式的异常响应：
      // 情况1: 字符串 "xxx"
      // 情况2: 对象 { message: "xxx" }
      // 情况3: 对象 { message: ["xxx1", "xxx2"] } (class-validator 验证错误)
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const resp = exceptionResponse as Record<string, any>;
        if (Array.isArray(resp.message)) {
          // class-validator 返回的数组，合并为字符串
          message = resp.message.join('；');
        } else if (resp.message) {
          message = resp.message;
        } else {
          message = exception.message;
        }
      } else {
        message = exception.message;
      }
    } else {
      // 非 HttpException（未知异常）
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = '服务器内部错误，请稍后重试';

      // 未知异常需要打印完整错误信息，便于排查
      this.logger.error('未知异常', exception);
    }

    // 3. 记录日志（HttpException 级别的日志）
    const errorName = exception?.constructor?.name ?? 'UnknownError';
    this.logger.warn(`[${errorName}] ${status} - ${JSON.stringify(message)}`);

    // 4. 返回统一格式的错误响应
    response.status(status).json({
      code: status,
      message: message,
      data: null,
      timestamp: new Date().toISOString(),
    });
  }
}
