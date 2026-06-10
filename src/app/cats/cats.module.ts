/**
 * ============================================================
 * 猫咪模块（Module）
 * ============================================================
 *
 * 模块职责：
 *   1. 注册 CatsController（处理 /cats 路由）
 *   2. 注册 CatsService（业务逻辑 + Prisma 操作）
 *
 * 依赖关系：
 *   CatsModule → CatsController → CatsService → PrismaService → MySQL
 *
 * 注意：由于 PrismaModule 是 @Global() 全局模块，
 *       CatsService 可以直接注入 PrismaService，不需要在 CatsModule 中导入 PrismaModule
 */

import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  // controllers：注册该模块的控制器，处理 HTTP 请求路由
  controllers: [CatsController],

  // providers：注册该模块的服务（Controller 通过构造函数注入）
  // 注意：PrismaService 不需要在这里注册，因为 PrismaModule 是全局的
  providers: [CatsService],

  // 导出 CatsService，供 AdminModule 等其他模块复用
  exports: [CatsService],
})
export class CatsModule {}
