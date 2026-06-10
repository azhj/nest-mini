/**
 * ============================================================
 * 认证模块（AuthModule）
 * ============================================================
 *
 * 职责：整合 JWT 认证所需的所有组件
 *
 * 包含：
 * - AuthController：处理登录、个人信息请求
 * - AuthService：JWT 签发逻辑
 * - JwtModule：提供 JwtService（用于签发 Token）
 * - PassportModule：提供 Passport 策略支持
 * - UsersModule：引入 UsersService（验证用户密码）
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    // Passport：提供 PassportStrategy 基类
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JwtModule：提供 JwtService 用于签发 Token
    JwtModule.register({
      /**
       * secret：签名密钥（防篡改）
       *
       * 生产环境：
       * 1. 在 .env 中配置 JWT_SECRET
       * 2. 使用 .env 中的值（process.env.JWT_SECRET）
       * 3. 密钥至少 32 字符
       */
      secret: process.env.JWT_SECRET ?? 'nest-mini-jwt-secret-key-2024',

      /**
       * signOptions：Token 签名选项
       *
       * expiresIn：Token 过期时间
       * - '30s'   = 30 秒
       * - '7d'    = 7 天
       * - '2h'    = 2 小时
       * - 3600    = 3600 秒
       */
      signOptions: {
        expiresIn: '7d',
      },
    }),

    // 引入 UsersModule：使用 UsersService 验证用户
    UsersModule,
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy, // JWT 验证策略（验证 Token）
    LocalStrategy, // 本地验证策略（验证用户名+密码）
  ],

  // 导出 JwtModule，使其他模块也能注入 JwtService
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
