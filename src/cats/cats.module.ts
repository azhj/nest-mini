/**
 * ============================================================
 * 猫咪模块（Module）
 * ============================================================
 *
 * 什么是 Module？
 * Module 是组织 NestJS 应用的基本单元。
 * 每个 Module 通常对应一个功能模块（如 Cats、Users、Orders）。
 *
 * 一个完整的 Module 结构：
 *   imports:  []  → 引入其他模块（如数据库模块、配置模块）
 *   controllers: [] → 注册控制器（处理 HTTP 请求）
 *   providers: [] → 注册服务/Provider（业务逻辑）
 *   exports:  [] → 导出本模块的 providers，供其他模块使用
 */

import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  // controllers：注册该模块的控制器，处理路由
  controllers: [CatsController],

  // providers：注册该模块的服务（Controller 通过构造函数注入）
  providers: [CatsService],

  // exports：将 CatsService 导出，供其他模块使用
  //          如果其他模块需要调用 CatsService，就必须在这里导出
  exports: [CatsService],
})
export class CatsModule {}
