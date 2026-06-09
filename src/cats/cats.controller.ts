/**
 * ============================================================
 * 猫咪控制器（Controller）- 路由处理层
 * ============================================================
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
import { ApiResponse } from '../common/api-response';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  async findAll(): Promise<ApiResponse<Cat[]>> {
    const result = await this.catsService.findAll();
    return ApiResponse.success(result, '查询成功');
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ApiResponse<Cat>> {
    const result = await this.catsService.findOne(id);
    return ApiResponse.success(result, '查询成功');
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createCatDto: CreateCatDto): Promise<ApiResponse<Cat>> {
    const result = await this.catsService.create(createCatDto);
    return ApiResponse.success(result, '新增成功');
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<ApiResponse<Cat>> {
    const result = await this.catsService.update(id, updateCatDto);
    return ApiResponse.success(result, '修改成功');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number): Promise<ApiResponse> {
    await this.catsService.remove(id);
    return ApiResponse.success(null, '删除成功');
  }
}
