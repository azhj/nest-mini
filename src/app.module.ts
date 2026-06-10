/**
 * ============================================================
 * 根模块（AppModule）
 * ============================================================
 *
 * 模块加载顺序：
 *   AppModule
 *     ├── PrismaModule (全局，所有模块共享)
 *     │     └── PrismaService → 连接 MySQL 数据库
 *     ├── HealthModule (健康检查)
 *     │     └── HealthController → /health 路由
 *     │     └── HealthService → 健康状态检查
 *     ├── AuthModule (认证模块)
 *     │     ├── AuthController → /auth 路由
 *     │     ├── AuthService → JWT 签发
 *     │     ├── JwtStrategy → JWT 验证策略
 *     │     └── LocalStrategy → 本地认证策略
 *     ├── UsersModule (用户模块)
 *     │     └── UsersService → 用户 CRUD
 *     ├── CatsModule
 *     │     ├── CatsController → /cats 路由
 *     │     └── CatsService → 业务逻辑
 *     └── StudentsModule
 *           ├── StudentsController → /students 路由
 *           └── StudentsService → 业务逻辑
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CatsModule } from './cats/cats.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    // PrismaModule.forRoot() 为全局注册，导入一次后所有模块都能用 PrismaService
    PrismaModule,
    // 健康检查模块
    HealthModule,
    // AuthModule 必须在 UsersModule 之前导入（AuthModule 依赖 UsersModule）
    AuthModule,
    UsersModule,
    CatsModule,
    StudentsModule,
  ],
})
export class AppModule {}
