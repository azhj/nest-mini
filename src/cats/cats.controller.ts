/**
 * ============================================================
 * 猫咪控制器（Controller）- 路由处理层
 * ============================================================
 *
 * 重大变化：Service 方法全部改为 async，所有调用都要 await
 *
 * 请求生命周期：
 *   HTTP 请求 → 中间件 → 守卫(Guard) → 管道(Pipe) → Controller → Service → Prisma → MySQL
 *   MySQL → Prisma → Service → Controller → 拦截器(Interceptor) → HTTP 响应
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import type { CreateCatDto } from './dto/create-cat.dto';
import type { UpdateCatDto } from './dto/update-cat.dto';
import type { Cat } from '@prisma/client';

@Controller('cats') // 👈 所有路由以 /cats 开头
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  /**
   * GET /cats
   * 获取所有猫咪列表
   *
   * 返回值类型：Promise<Cat[]>
   * - 之前：Cat[]（同步）
   * - 现在：Promise<Cat[]>（异步）
   */
  @Get()
  async findAll(): Promise<Cat[]> {
    return await this.catsService.findAll();
  }

  /**
   * GET /cats/:id
   * 根据 ID 获取单个猫咪
   *
   * @Param('id') 的作用：
   * NestJS 会自动从 URL 中提取 :id 部分，注入到 id 参数中
   * 例如：GET /cats/clx9k5g2b0000qzqng5d5e9kf → id = 'clx9k5g2b0000qzqng5d5e9kf'
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Cat> {
    return await this.catsService.findOne(id);
  }

  /**
   * POST /cats
   * 创建一只新猫咪
   *
   * @Body() 的作用：
   * 自动解析请求体（JSON），并将数据映射到 CreateCatDto 对象
   * DTO 中的验证装饰器会自动校验数据格式，不合法则返回 400 错误
   *
   * @HttpCode(HttpStatus.CREATED)：
   * 默认 POST 返回 200，改为 201 Created，更符合 RESTful 规范
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
    return await this.catsService.create(createCatDto);
  }

  /**
   * PUT /cats/:id
   * 完整更新一只猫咪
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<Cat> {
    return await this.catsService.update(id, updateCatDto);
  }

  /**
   * DELETE /cats/:id
   * 删除一只猫咪
   *
   * @HttpCode(HttpStatus.NO_CONTENT)：
   * DELETE 成功返回 204 No Content（无响应体）
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.catsService.remove(id);
  }
}
