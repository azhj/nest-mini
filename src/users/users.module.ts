/**
 * ============================================================
 * 用户模块（UsersModule）
 * ============================================================
 */

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  // 导出 UsersService，供 AuthModule 使用（验证用户密码）
  exports: [UsersService],
})
export class UsersModule {}
