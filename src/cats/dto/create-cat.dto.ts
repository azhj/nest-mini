/**
 * ============================================================
 * 创建猫咪的数据传输对象（CreateCatDto）
 * ============================================================
 *
 * 什么是 DTO？
 * DTO = Data Transfer Object（数据传输对象）
 * DTO 是客户端发送到服务器的数据的"形状"，用于：
 *
 *  1. 类型检查：TypeScript 编译器帮你检查数据类型
 *  2. 验证输入：用 class-validator 自动校验数据合法性
 *  3. 接口文档化：一眼看出接口需要什么字段
 *  4. 解耦：内部模型和外部接口可以独立变化
 *
 * 注意：DTO 只需要定义"对外暴露的字段"，不一定等于 Entity 的所有字段
 * 比如创建时不需要传 id（由服务端生成），DTO 里就不写 id
 *
 * class-validator 常用装饰器：
 * @IsString()       - 必须是字符串
 * @IsInt()          - 必须是整数
 * @IsNumber()       - 必须是数字
 * @Min(length)      - 最小值 / 最小长度
 * @Max(length)      - 最大值 / 最大长度
 * @MinLength(n)     - 字符串最小 n 个字符
 * @MaxLength(n)     - 字符串最大 n 个字符
 * @IsEmail()        - 必须是邮箱格式
 * @IsEnum()         - 必须是枚举值之一
 * @IsIn([...])      - 必须是指定数组中的值之一
 * @IsOptional()     - 字段可选（不传也不报错）
 * @IsArray()        - 必须是数组
 * @ValidateNested() - 嵌套对象需要深度验证
 * @Type(() => xxx)  - 配合 class-transformer 进行类型转换（字符串→数字）
 */

import { IsString, IsInt, Min, Max, MinLength, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const CAT_BREEDS = [
  'orange',
  'black',
  'white',
  'brown',
  'gray',
  'tabby',
  'siamese',
] as const;

/** 创建猫咪时传入的参数类型（不需要传 id，由服务端生成） */
export class CreateCatDto {
  @ApiProperty({ description: '猫咪名字', example: '团子' })
  @IsString({ message: '名字必须是字符串' })
  @MinLength(1, { message: '名字不能为空' })
  name: string;

  @ApiProperty({ description: '猫咪年龄', example: 3, minimum: 1, maximum: 30 })
  @IsInt({ message: '年龄必须是整数' })
  @Min(1, { message: '年龄最小为 1' })
  @Max(30, { message: '年龄最大为 30' })
  age: number;

  @ApiProperty({
    description: '猫咪品种',
    example: 'orange',
    enum: CAT_BREEDS,
  })
  @IsString()
  @IsIn(CAT_BREEDS, {
    message: `品种必须是 ${CAT_BREEDS.join('/')} 之一`,
  })
  breed: string;
}
