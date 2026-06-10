/**
 * ============================================================
 * Prisma 模块（PrismaModule）
 * ============================================================
 *
 * 什么是 PrismaModule？
 * PrismaModule 是 Prisma 的封装模块，负责：
 * 1. 注册 PrismaService（持有 PrismaClient 实例）
 * 2. 导出 PrismaService，让其他模块可以使用数据库
 *
 * 两种使用方式：
 * - PrismaModule.forRoot()        → 全局模块（在 AppModule 中导入一次）
 * - PrismaModule.forRootAsync()   → 异步配置（如从配置服务读取 URL）
 *
 * 为什么要全局模块？
 * 数据库连接只需要建立一次，全局模块确保 PrismaService 在整个应用中唯一。
 */

import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // @Global 装饰器：声明为全局模块，所有模块都能直接注入 PrismaService
@Module({
  providers: [PrismaService], // 注册 PrismaService
  exports: [PrismaService], // 导出，供其他模块使用
})
export class PrismaModule {}
