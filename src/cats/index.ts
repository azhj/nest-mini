/**
 * Cats 模块的统一导出（Barrel Export）
 * 方便其他模块通过统一路径导入：
 *   import { CatsModule } from './cats';
 *
 * 而不是：
 *   import { CatsModule } from './cats/cats.module';
 */
export * from './cats.module';
export * from './cats.controller';
export * from './cats.service';
export * from './entities/cat.entity';
export * from './dto/create-cat.dto';
export * from './dto/update-cat.dto';
