/**
 * Cats 模块的统一导出（Barrel Export）
 *
 * 注意：从 Prisma 集成的版本开始，Cat 类型不再从 entities/cat.entity.ts 导出，
 *       而是直接从 @prisma/client 导入：
 *         import { Cat } from '@prisma/client';
 *       这是因为 Prisma 会根据 schema.prisma 自动生成完整的类型定义。
 */
export * from './cats.module';
export * from './cats.controller';
export * from './cats.service';
export * from './dto/create-cat.dto';
export * from './dto/update-cat.dto';
