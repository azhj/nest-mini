/**
 * ============================================================
 * 根模块（AppModule）
 * ============================================================
 *
 * 升级：本次添加了 PrismaModule，作为全局数据库模块
 *
 * 模块加载顺序：
 *   AppModule
 *     ├── PrismaModule (全局，所有模块共享)
 *     │     └── PrismaService → 连接 MySQL 数据库
 *     └── CatsModule
 *           ├── CatsController → 处理 /cats 路由
 *           └── CatsService → 业务逻辑（依赖 PrismaService）
 */

import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CatsModule } from './cats/cats.module';
import { StudentsModule } from './students/students.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  // imports：引入子模块
  // PrismaModule.forRoot() 为全局注册，导入一次后所有模块都能用 PrismaService
  imports: [PrismaModule, CatsModule, StudentsModule],

  // controllers：根模块自己的控制器（处理根路径 / 的请求）
  controllers: [AppController],

  // providers：根模块自己的服务
  providers: [AppService],
})
export class AppModule {}
