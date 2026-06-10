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
 *     ├── CatsModule (猫咪模块)
 *     │     ├── CatsController → /cats 路由
 *     │     └── CatsService → 业务逻辑
 *     ├── StudentsModule (学生模块)
 *     │     ├── StudentsController → /students 路由
 *     │     └── StudentsService → 业务逻辑
 *     └── AdminModule (PC后台管理模块)
 *           └── AdminStudentsController → /admin/students 路由
 *           └── AdminCatsController → /admin/cats 路由
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from './app/prisma/prisma.module';
import { HealthModule } from './app/health/health.module';
import { AuthModule } from './app/auth/auth.module';
import { UsersModule } from './app/users/users.module';
import { CatsModule } from './app/cats/cats.module';
import { StudentsModule } from './app/students/students.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // PrismaModule.forRoot() 为全局注册，导入一次后所有模块都能用 PrismaService
    PrismaModule,
    // 健康检查模块（保留在根路径 /health）
    HealthModule,
    // AuthModule 必须在 UsersModule 之前导入（AuthModule 依赖 UsersModule）
    AuthModule,
    UsersModule,
    CatsModule,
    StudentsModule,
    // PC后台管理模块（所有接口自动加 /admin 前缀，见 main.ts setGlobalPrefix）
    AdminModule,
  ],
})
export class AppModule {}
