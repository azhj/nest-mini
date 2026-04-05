/**
 * ============================================================
 * Prisma 服务（PrismaService）
 * ============================================================
 *
 * 什么是 PrismaService？
 * 在 NestJS 中，我们需要一个 @Injectable() 的服务来持有 PrismaClient 实例，
 * 这样才能在 Controller / Service 中通过依赖注入使用数据库。
 *
 * 为什么需要单独封装？
 * PrismaClient 本身是 @Injectable() 的，但最佳实践是：
 * 1. 在 onModuleInit 中连接数据库
 * 2. 在 onModuleDestroy 中断开连接（优雅关闭）
 * 3. 如果有多个模块要用 Prisma，只需导出 PrismaService 即可
 *
 * 生命周期钩子（Lifecycle Hooks）：
 * - onModuleInit()     → 模块初始化时调用（连接数据库）
 * - onModuleDestroy()  → 模块销毁时调用（断开连接）
 */

import {
  Injectable,          // NestJS 依赖注入装饰器
  OnModuleInit,         // 模块初始化钩子
  OnModuleDestroy,      // 模块销毁钩子
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * onModuleInit：模块初始化时调用
   * 作用：确保 PrismaClient 在模块启动时就连接数据库
   *
   * Prisma v5+ 默认延迟连接（懒连接），首次查询时才连接。
   * 这里主动调用 $connect() 可以让连接在启动时就建立，早发现连接问题。
   */
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma 数据库连接已建立');
  }

  /**
   * onModuleDestroy：模块销毁时调用
   * 作用：优雅地关闭数据库连接
   *
   * 为什么需要？
   * - 防止正在进行的查询被强制中断
   * - 释放数据库连接资源
   * - 在 Node.js 进程退出前清理资源
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🔌 Prisma 数据库连接已断开');
  }
}
