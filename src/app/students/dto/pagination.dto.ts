/**
 * ============================================================
 * 分页查询 DTO
 * ============================================================
 */

import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/** 基础分页参数 DTO */
export class PaginationDto {
  @ApiPropertyOptional({ description: '当前页码', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码最小为 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: '每页条数',
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每页条数必须是整数' })
  @Min(1, { message: '每页条数最小为 1' })
  @Max(100, { message: '每页条数最大为 100' })
  pageSize?: number = 10;
}

/** 学生分页查询 DTO */
export class QueryStudentDto extends PaginationDto {
  @ApiPropertyOptional({ description: '学生姓名（模糊匹配）', example: '张' })
  @IsOptional()
  @IsString({ message: '姓名必须是字符串' })
  name?: string;

  @ApiPropertyOptional({ description: '年级（精确匹配）', example: '高一' })
  @IsOptional()
  @IsString({ message: '年级必须是字符串' })
  grade?: string;

  @ApiPropertyOptional({ description: '班级（精确匹配）', example: '1班' })
  @IsOptional()
  @IsString({ message: '班级必须是字符串' })
  className?: string;
}
