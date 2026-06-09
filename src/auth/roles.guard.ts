/**
 * ============================================================
 * 角色守卫（RolesGuard）
 * ============================================================
 *
 * 职责：检查当前用户是否具有访问接口所需的角色
 *
 * 工作原理：
 * 1. 从 @Roles() 装饰器获取接口需要的角色（如 ['admin']）
 * 2. 从 request.user 获取当前用户的角色
 * 3. 判断是否匹配，不匹配则抛出 ForbiddenException
 *
 * 使用方式：
 * @Controller('cats')
 * @UseGuards(JwtAuthGuard, RolesGuard) // 注意：RolesGuard 必须在 JwtAuthGuard 之后
 * @Roles('admin')                       // 只有 admin 角色可以访问
 * export class CatsController {}
 */

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. 获取接口要求的角色（从 @Roles() 装饰器）
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),   // 路由级别
      context.getClass(),     // Controller 级别
    ]);

    // 如果没有配置 @Roles()，直接放行
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 2. 获取当前请求
    const request = context.switchToHttp().getRequest();

    // 3. 获取当前用户（由 JwtAuthGuard 挂载）
    const user = request.user;

    // 4. 检查用户角色是否匹配
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('权限不足，需要管理员权限');
    }

    return true;
  }
}
