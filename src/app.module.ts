/**
 * ============================================================
 * 根模块（AppModule）
 * ============================================================
 *
 * 什么是 AppModule？
 * AppModule 是整个应用的根模块（Root Module），
 * 它负责汇总和组织所有子模块。
 *
 * NestJS 应用启动流程：
 *   main.ts
 *     ↓
 *   NestFactory.create(AppModule)  ← 创建应用实例
 *     ↓
 *   AppModule 识别所有 @Module 装饰的模块
 *     ↓
 *   实例化所有 Controller 和 Service
 *     ↓
 *   监听端口，启动 HTTP 服务器
 *
 * 模块组织原则：
 * - 每个功能模块独立一个目录（如 cats/、users/）
 * - 根模块只负责导入和汇总，不放业务逻辑
 */

import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  // imports：引入其他模块，把子模块的功能组合进来
  //           CatsModule 提供的 Controller 和 Service 会被加载
  imports: [CatsModule],

  // controllers：根模块自己的控制器（处理根路径 / 的请求）
  controllers: [AppController],

  // providers：根模块自己的服务
  providers: [AppService],
})
export class AppModule {}
