/**
 * ============================================================
 * 学生 DTO（Data Transfer Object）
 * ============================================================
 */

import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** 创建学生 DTO */
export class CreateStudentDto {
  @ApiProperty({ description: '学生姓名', example: '张三' })
  @IsString({ message: '姓名必须是字符串' })
  name: string;

  @ApiProperty({ description: '年龄', example: 15, minimum: 1, maximum: 100 })
  @IsInt({ message: '年龄必须是整数' })
  @Min(1, { message: '年龄最小为 1' })
  @Max(100, { message: '年龄最大为 100' })
  @Type(() => Number)
  age: number;

  @ApiProperty({ description: '性别', example: '男', enum: ['男', '女'] })
  @IsString({ message: '性别必须是字符串' })
  gender: string;

  @ApiProperty({ description: '年级', example: '高一' })
  @IsString({ message: '年级必须是字符串' })
  grade: string;

  @ApiProperty({ description: '班级', example: '1班' })
  @IsString({ message: '班级必须是字符串' })
  className: string;

  @ApiProperty({ description: '联系电话', example: '13800138000' })
  @IsString({ message: '联系电话必须是字符串' })
  phone: string;

  @ApiProperty({ description: '家庭住址', example: '北京市朝阳区xxx路xx号' })
  @IsString({ message: '住址必须是字符串' })
  address: string;

  @ApiPropertyOptional({ description: '头像URL', example: '/uploads/xxx.png' })
  @IsOptional()
  @IsString({ message: '头像必须是字符串' })
  avatar?: string;
}

/** 更新学生 DTO（所有字段可选） */
export class UpdateStudentDto {
  @ApiPropertyOptional({ description: '学生姓名', example: '张三' })
  @IsOptional()
  @IsString({ message: '姓名必须是字符串' })
  name?: string;

  @ApiPropertyOptional({
    description: '年龄',
    example: 15,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsInt({ message: '年龄必须是整数' })
  @Min(1)
  @Max(100)
  @Type(() => Number)
  age?: number;

  @ApiPropertyOptional({
    description: '性别',
    example: '男',
    enum: ['男', '女'],
  })
  @IsOptional()
  @IsString({ message: '性别必须是字符串' })
  gender?: string;

  @ApiPropertyOptional({ description: '年级', example: '高一' })
  @IsOptional()
  @IsString({ message: '年级必须是字符串' })
  grade?: string;

  @ApiPropertyOptional({ description: '班级', example: '1班' })
  @IsOptional()
  @IsString({ message: '班级必须是字符串' })
  className?: string;

  @ApiPropertyOptional({ description: '联系电话', example: '13800138000' })
  @IsOptional()
  @IsString({ message: '联系电话必须是字符串' })
  phone?: string;

  @ApiPropertyOptional({
    description: '家庭住址',
    example: '北京市朝阳区xxx路xx号',
  })
  @IsOptional()
  @IsString({ message: '住址必须是字符串' })
  address?: string;

  @ApiPropertyOptional({ description: '头像URL', example: '/uploads/xxx.png' })
  @IsOptional()
  @IsString({ message: '头像必须是字符串' })
  avatar?: string;
}
