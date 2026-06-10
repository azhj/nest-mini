/**
 * ============================================================
 * 更新猫咪的数据传输对象（UpdateCatDto）
 * ============================================================
 *
 * UpdateDto 和 CreateDto 的区别：
 * - Create：创建时必须传哪些字段（如 name, age, breed 必填）
 * - Update：更新时哪些字段可以改（所有字段都标记为 @IsOptional()）
 *
 * 为什么 Update 的字段都要 @IsOptional()？
 * 因为 RESTful 更新通常是"部分更新"（PATCH）：
 * 客户端只传需要改的字段，不传的字段保持原值不变。
 * 如果不加 @IsOptional()，不传字段会报错。
 */

import {
  IsString,
  IsInt,
  Min,
  Max,
  MinLength,
  IsIn,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

const CAT_BREEDS = [
  'orange',
  'black',
  'white',
  'brown',
  'gray',
  'tabby',
  'siamese',
] as const;

export class UpdateCatDto {
  @ApiPropertyOptional({ description: '猫咪名字', example: '团子' })
  @IsOptional()
  @IsString({ message: '名字必须是字符串' })
  @MinLength(1, { message: '名字不能为空' })
  name?: string;

  @ApiPropertyOptional({
    description: '猫咪年龄',
    example: 3,
    minimum: 1,
    maximum: 30,
  })
  @IsOptional()
  @IsInt({ message: '年龄必须是整数' })
  @Min(1, { message: '年龄最小为 1' })
  @Max(30, { message: '年龄最大为 30' })
  @Type(() => Number) // 确保 Body 中传入的字符串自动转为数字
  age?: number;

  @ApiPropertyOptional({
    description: '猫咪品种',
    example: 'orange',
    enum: CAT_BREEDS,
  })
  @IsOptional()
  @IsString()
  @IsIn(CAT_BREEDS, {
    message: `品种必须是 ${CAT_BREEDS.join('/')} 之一`,
  })
  breed?: string;
}
