/**
 * ============================================================
 * 用户 DTO（Data Transfer Object）
 * ============================================================
 *
 * 什么是 DTO？
 * DTO 是数据传输对象，用于定义 API 请求的数据格式。
 * 结合 class-validator 装饰器，自动进行数据验证。
 *
 * 本模块 DTO：
 * - CreateUserDto：注册用户（用户名、密码）
 * - UpdateUserDto：更新用户（可选字段）
 * - LoginDto：登录（用户名、密码）
 */

import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** 注册 DTO */
export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(3, { message: '用户名至少 3 个字符' })
  @MaxLength(20, { message: '用户名最多 20 个字符' })
  username: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码至少 6 个字符' })
  @MaxLength(50, { message: '密码最多 50 个字符' })
  password: string;
}

/** 更新用户 DTO */
export class UpdateUserDto {
  @ApiPropertyOptional({ description: '新密码' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    description: '角色',
    example: 'admin',
    enum: ['admin', 'user'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'user'])
  role?: string;
}

/** 登录 DTO */
export class LoginDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString()
  username: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  password: string;
}
