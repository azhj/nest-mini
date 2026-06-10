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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CatsService } from './cats.service';
import { CreateCatDto, UpdateCatDto } from './dto';
import type { Cat } from '@prisma/client';
import { ApiResponse } from '../common/api-response';

/**
 * 猫咪模块 API 文档
 * @description 提供猫咪的增删改查接口
 */
@ApiTags('cats')
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  /**
   * 获取所有猫咪列表
   */
  @Get()
  @ApiOperation({ summary: '获取所有猫咪列表' })
  async findAll(): Promise<ApiResponse<Cat[]>> {
    const result = await this.catsService.findAll();
    return ApiResponse.success(result, '查询成功');
  }

  /**
   * 根据 ID 获取单只猫咪
   */
  @Get(':id')
  @ApiOperation({ summary: '根据 ID 获取单只猫咪' })
  async findOne(@Param('id') id: number): Promise<ApiResponse<Cat>> {
    const result = await this.catsService.findOne(id);
    return ApiResponse.success(result, '查询成功');
  }

  /**
   * 创建新猫咪
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '创建新猫咪' })
  async create(@Body() createCatDto: CreateCatDto): Promise<ApiResponse<Cat>> {
    const result = await this.catsService.create(createCatDto);
    return ApiResponse.success(result, '新增成功');
  }

  /**
   * 更新猫咪信息（支持部分字段更新）
   */
  @Put(':id')
  @ApiOperation({ summary: '更新猫咪信息' })
  async update(
    @Param('id') id: number,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<ApiResponse<Cat>> {
    const result = await this.catsService.update(id, updateCatDto);
    return ApiResponse.success(result, '修改成功');
  }

  /**
   * 删除猫咪
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除猫咪' })
  async remove(@Param('id') id: number): Promise<ApiResponse> {
    await this.catsService.remove(id);
    return ApiResponse.success(null, '删除成功');
  }
}
