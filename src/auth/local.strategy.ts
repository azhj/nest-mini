/**
 * ============================================================
 * 本地策略（LocalStrategy）
 * ============================================================
 *
 * 职责：验证用户名 + 密码（登录时使用）
 *
 * Passport-Local 工作流程：
 * 1. 客户端 POST /auth/login { username, password }
 * 2. LocalAuthGuard 拦截，调用 LocalStrategy.validate()
 * 3. this.validate() 调用 UsersService 验证用户密码
 * 4. 验证通过：返回用户对象 → request.user
 * 5. 验证失败：抛出 UnauthorizedException
 *
 * 注意：这是登录时的验证，与 JWT 不同！
 * - JWT Strategy：验证请求头中的 Token（用于已登录用户的接口访问）
 * - Local Strategy：验证用户名 + 密码（用于登录）
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    // 默认从 body 获取 username 和 password
    // 可通过 super() 自定义字段名
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  /**
   * validate()：验证用户名和密码
   *
   * @param username 用户名
   * @param password 明文密码
   * @returns 验证成功返回用户对象
   */
  async validate(username: string, password: string) {
    // 1. 根据用户名查询用户
    const user = await this.usersService.findByUsername(username);

    // 2. 用户不存在
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 3. 验证密码（bcrypt.compare 内部处理加密比对）
    const isValid = await this.usersService.validatePassword(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 4. 验证成功，返回用户信息（不含密码）
    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
