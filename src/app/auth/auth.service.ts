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
  login(user: { id: number; username: string; role: string }) {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: '7d',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  /**
   * 获取当前用户信息（通过 Token）
   */
  async getProfile(userId: number) {
    return await this.usersService.findOne(userId);
  }
}
