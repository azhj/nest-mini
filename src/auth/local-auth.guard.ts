/**
 * ============================================================
 * 本地认证守卫（LocalAuthGuard）
 * ============================================================
 *
 * 职责：保护登录接口，强制要求提供用户名和密码
 *
 * 使用场景：
 * @Post('login')
 * @UseGuards(LocalAuthGuard)  // ← 只有携带正确的 username + password 才能通过
 * async login(@Body() loginDto: LoginDto) {
 *   return this.authService.login(request.user);
 * }
 *
 * 原理：
 * LocalAuthGuard 继承 AuthGuard('local')
 * 会自动从请求体中提取 username 和 password
 * 然后交给 LocalStrategy.validate() 验证
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
