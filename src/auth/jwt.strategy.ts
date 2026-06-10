/**
 * ============================================================
 * JWT 策略（JwtStrategy）
 * ============================================================
 *
 * 职责：从 JWT Token 中解析出用户信息，并挂载到 request.user
 *
 * Passport-JWT 工作流程：
 * 1. 客户端请求时携带 Header: Authorization: Bearer <jwt_token>
 * 2. JwtAuthGuard 调用 AuthGuard('jwt')
 * 3. Passport 的 JWTStrategy 自动拦截，调用 this.validate()
 * 4. this.validate() 从 token payload 中提取用户信息
 * 5. 将用户对象挂载到 request.user
 * 6. 守卫通过则继续，失败则抛出 UnauthorizedException
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

/** JWT Payload 的类型定义 */
export interface JwtPayload {
  sub: number; // 用户 ID
  username: string;
  role: string;
  iat?: number; // 签发时间（自动附加）
  exp?: number; // 过期时间（自动附加）
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      /**
       * jwtFromRequest：从哪里提取 JWT
       * ExtractJwt.fromAuthHeaderAsBearerToken() 表示从：
       * Authorization: Bearer <token>
       */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      /**
       * ignoreExpiration：是否忽略过期验证
       * false = 严格验证，Token 过期则报错
       * true  = 忽略过期（不安全）
       */
      ignoreExpiration: false,

      /**
       * secretOrKey：签名密钥（必须与签发时一致）
       *
       * 为什么用密钥签名？
       * 客户端无法伪造 Token，因为没有密钥无法生成有效签名
       * 服务端用密钥验证 Token 是否被篡改
       *
       * 生产环境建议：
       * - 使用 .env 文件存储，不要硬编码
       * - 密钥至少 32 字符，建议 64 字符
       */
      secretOrKey: process.env.JWT_SECRET ?? 'nest-mini-jwt-secret-key-2024',
    });
  }

  /**
   * validate()：JWT 验证通过后的回调
   *
   * @param payload JWT Token 中解码出的用户信息（签发时写入的 sub/username/role）
   * @returns 将用户对象挂载到 request.user
   *
   * 注意：
   * - 这里可以查数据库验证用户是否存在（更安全但有性能损耗）
   * - 也可以直接信任 payload（性能更好）
   */
  async validate(payload: JwtPayload) {
    // 方式 A：直接信任 payload（推荐，用于性能要求高的场景）
    // return { id: payload.sub, username: payload.username, role: payload.role };

    // 方式 B：查数据库验证用户存在（更安全，防止用户被删除后 Token 仍有效）
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      throw new UnauthorizedException('用户不存在或已被删除');
    }

    // 返回的对象会被挂载到 request.user
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
