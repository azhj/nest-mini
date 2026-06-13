/**
 * ============================================================
 * 上传控制器（Controller）- 路由处理层
 * ============================================================
 *
 * 请求生命周期：
 *   HTTP 请求 → 中间件 → 守卫(Guard) → 管道(Pipe) → Controller → Service → 上传逻辑
 */

import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { UploadService } from './upload.service';
import { ApiResponse } from '../common/api-response';
import { Public } from '../auth/roles.decorator';

/** 上传目录路径 */
const UPLOAD_DIR = join(process.cwd(), 'uploads');

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * 上传单张图片
   * 支持 jpg、jpeg、png、gif、webp 格式
   * 最大文件大小：5MB
   */
  @Post('image')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, UPLOAD_DIR);
        },
        filename: (req, file, cb) => {
          const originalName: string = file?.originalname ?? 'file';
          const ext = originalName
            .substring(originalName.lastIndexOf('.'))
            .toLowerCase();
          const timestamp = Date.now();
          const random = Math.random().toString(36).substring(2, 10);
          const filename = `${timestamp}-${random}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file) {
          cb(null, false);
          return;
        }
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(
            new BadRequestException(
              '只支持上传 jpg、jpeg、png、gif、webp 格式的图片',
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @ApiOperation({ summary: '上传单张图片' })
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): ApiResponse<{ url: string; filename: string; size: number }> {
    if (!file) {
      throw new BadRequestException('请选择要上传的图片');
    }
    const url = this.uploadService.getFileUrl(file.filename);
    return ApiResponse.success(
      {
        url,
        filename: file.filename,
        size: file.size,
      },
      '上传成功',
    );
  }

  /**
   * 上传多张图片
   * 支持 jpg、jpeg、png、gif、webp 格式
   * 最大文件大小：5MB
   * 最大数量：9张
   */
  @Post('images')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor('files', 9, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, UPLOAD_DIR);
        },
        filename: (req, file, cb) => {
          const originalName: string = file?.originalname ?? 'file';
          const ext = originalName
            .substring(originalName.lastIndexOf('.'))
            .toLowerCase();
          const timestamp = Date.now();
          const random = Math.random().toString(36).substring(2, 10);
          const filename = `${timestamp}-${random}${ext}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file) {
          cb(null, false);
          return;
        }
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(
            new BadRequestException(
              '只支持上传 jpg、jpeg、png、gif、webp 格式的图片',
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @ApiOperation({ summary: '上传多张图片' })
  uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
  ): ApiResponse<Array<{ url: string; filename: string; size: number }>> {
    if (!files || files.length === 0) {
      throw new BadRequestException('请选择要上传的图片');
    }
    const result = files.map((file) => ({
      url: this.uploadService.getFileUrl(file.filename),
      filename: file.filename,
      size: file.size,
    }));
    return ApiResponse.success(result, '上传成功');
  }
}
