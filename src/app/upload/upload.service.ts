/**
 * ============================================================
 * 上传服务（Service）- 业务逻辑层
 * ============================================================
 *
 * 职责：处理文件上传的核心逻辑
 */

import { Injectable } from '@nestjs/common';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class UploadService {
  private readonly uploadDir: string;

  constructor() {
    this.uploadDir = join(process.cwd(), 'uploads');
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  generateFileName(originalName: string): string {
    const ext = extname(originalName).toLowerCase();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${random}${ext}`;
  }

  getFilePath(filename: string): string {
    return join(this.uploadDir, filename);
  }

  getFileUrl(filename: string, baseUrl?: string): string {
    const uploadsPath = `/uploads/${filename}`;
    if (baseUrl) {
      return `${baseUrl.replace(/\/$/, '')}${uploadsPath}`;
    }
    return uploadsPath;
  }

  getUploadDir(): string {
    return this.uploadDir;
  }
}
