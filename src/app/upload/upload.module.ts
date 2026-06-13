/**
 * ============================================================
 * 上传模块（Module）
 * ============================================================
 *
 * 模块加载顺序：
 *   AppModule
 *     └── UploadModule
 *           └── UploadController → /upload 路由
 *           └── UploadService → 文件处理逻辑
 */

import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
