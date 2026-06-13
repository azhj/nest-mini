/**
 * ============================================================
 * JWT 守卫（JwtAuthGuard）
 * ============================================================
 *
 * 职责：验证请求头中的 JWT Token 是否有效
 *
 * 工作原理：
 * 1. 检查路由是否标记了 @Public()（跳过验证）
 * 2. 从请求头 Authorization: Bearer <token> 中提取 Token
 * 3. 调用 JwtStrategy.validate() 验证并解析 payload
 * 4. 验证通过：将 user 对象挂载到 request.user
 * 5. 验证失败：抛出 UnauthorizedException
 *
 * 使用方式：
 * - 全局守卫（默认）：所有接口需要登录验证
 * - @Public()：标记路由跳过验证（如登录接口）
 */

import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './roles.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser>(err: Error | null, user: TUser, info: Error | null) {
    if (err || !user) {
      throw err || new UnauthorizedException('登录已过期，请重新登录');
    }
    void info;
    return user;
  }
}
