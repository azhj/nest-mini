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

interface ExceptionResponse {
  message?: string | string[];
  error?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as ExceptionResponse;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (exceptionResponse?.message) {
        const msgs = exceptionResponse.message;
        message = Array.isArray(msgs) ? msgs.join('；') : msgs;
      } else {
        message = exception.message;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = '服务器内部错误，请稍后重试';
      this.logger.error('未知异常', exception as Error);
    }

    const errorName = (exception as Error)?.constructor?.name ?? 'UnknownError';
    this.logger.warn(`[${errorName}] ${status} - ${message}`);

    response.status(status).json({
      code: status,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    });
  }
}
