/**
 * ============================================================
 * JWT 守卫（JwtAuthGuard）
 * ============================================================
 *
 * 职责：验证请求头中的 JWT Token 是否有效
 *
 * 工作原理：
 * 1. 从请求头 Authorization: Bearer <token> 中提取 Token
 * 2. 调用 JwtStrategy.validate() 验证并解析 payload
 * 3. 验证通过：将 user 对象挂载到 request.user
 * 4. 验证失败：抛出 UnauthorizedException
 *
 * 使用方式：
 * - 局部守卫：@UseGuards(JwtAuthGuard) 加在 Controller 或路由上
 * - 全局守卫：在 AppModule 中配置 app.useGlobalGuards()
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // AuthGuard('jwt') 会自动使用 JwtStrategy
  // 内部会调用 jwt.strategy.ts 中的 validate() 方法
}
