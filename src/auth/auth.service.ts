/**
 * ============================================================
 * 认证服务（AuthService）- JWT 签发与管理
 * ============================================================
 *
 * 职责：
 * 1. 用户登录验证（签发 JWT Token）
 * 2. Token 刷新（可选）
 * 3. 用户信息封装
 */

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 登录：验证用户后签发 JWT Token
   *
   * 流程：
   * 1. UsersService.validatePassword() 已在外层验证过（通过 LocalStrategy）
   * 2. 构造 JWT Payload（sub=用户ID, username, role）
   * 3. 使用 JwtService.sign() 生成 Token
   * 4. 返回 Token 和用户信息
   */
  async login(user: { id: number; username: string; role: string }) {
    // 构造 Payload（注意：不要在 payload 中存储敏感信息如密码）
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    // 签发 Token
    // JWT 组成：Header.Payload.Signature
    // 签名部分用 secretOrKey 加密，防篡改
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,         // JWT Token，客户端保存
      tokenType: 'Bearer', // Token 类型（固定值）
      expiresIn: '7d',     // 过期时间（方便客户端显示）
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  /**
   * 获取当前用户信息（通过 Token）
   *
   * 使用场景：
   * GET /auth/profile
   * @UseGuards(JwtAuthGuard)
   * async getProfile(@Request() req) {
   *   return this.authService.getProfile(req.user);
   * }
   */
  async getProfile(userId: number) {
    return await this.usersService.findOne(userId);
  }
}
