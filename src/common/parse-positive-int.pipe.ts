/**
 * ============================================================
 * 转换管道（ParseIntPipe）- 内置管道示例
 * ============================================================
 *
 * 什么是管道（Pipe）？
 * 管道是 @Injectable() 的类，有两个功能：
 *   1. 转换（Transform）：将输入转换为期望格式（如字符串 → 数字）
 *   2. 验证（Validation）：检查输入是否符合规则，不符合抛异常
 *
 * NestJS 内置管道（开箱即用）：
 *   - ParseIntPipe：字符串 → 整数，转换失败抛 BadRequestException
 *   - ParseBoolPipe：字符串 → 布尔值
 *   - DefaultValuePipe：提供默认值
 *   - ValidationPipe：DTO 验证（已在 main.ts 全局配置）
 *
 * 自定义管道示例见下方：
 */

/**
 * ============================================================
 * 自定义管道：正整数管道（PositiveIntPipe）
 * ============================================================
 *
 * 需求：参数必须是正整数，否则报错
 *
 * 使用场景：
 *   @Get(':id')
 *   findOne(@Param('id', new ParsePositiveIntPipe()) id: number) {}
 */

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

/**
 * 自定义管道：解析并验证正整数
 *
 * - 输入："123" → 输出：123
 * - 输入："-5"  → 抛出 BadRequestException
 * - 输入："abc" → 抛出 BadRequestException
 */
@Injectable()
export class PositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);

    // 1. 检查是否为有效数字
    if (isNaN(val)) {
      throw new BadRequestException(`参数 "${metadata.data}" 必须是有效数字`);
    }

    // 2. 检查是否为正整数
    if (val <= 0) {
      throw new BadRequestException(`参数 "${metadata.data}" 必须是正整数`);
    }

    return val;
  }
}
