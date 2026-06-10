/**
 * ============================================================
 * PC后台猫咪控制器（AdminCatsController）
 * ============================================================
 *
 * PC后台接口：所有路由自动加 /admin 前缀
 *
 * 接口设计：
 * GET  /admin/cats          - 获取所有猫咪列表
 * GET  /admin/cats/:id      - 获取单个猫咪详情
 * POST /admin/cats           - 创建猫咪
 * PUT  /admin/cats/:id      - 更新猫咪
 * DELETE /admin/cats/:id     - 删除猫咪
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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CatsService } from '../app/cats/cats.service';
import { CreateCatDto, UpdateCatDto } from '../app/cats/dto';
import type { Cat } from '@prisma/client';
import { ApiResponse } from '../app/common/api-response';
import { JwtAuthGuard } from '../app/auth/jwt-auth.guard';
import { RolesGuard } from '../app/auth/roles.guard';
import { Roles } from '../app/auth/roles.decorator';

@ApiTags('admin-cats')
@Controller('admin/cats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminCatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @ApiOperation({ summary: '获取所有猫咪列表（PC后台）' })
  async findAll(): Promise<ApiResponse<Cat[]>> {
    const result = await this.catsService.findAll();
    return ApiResponse.success(result, '查询成功');
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个猫咪详情（PC后台）' })
  async findOne(@Param('id') id: number): Promise<ApiResponse<Cat>> {
    const result = await this.catsService.findOne(id);
    return ApiResponse.success(result, '查询成功');
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '创建猫咪（PC后台）' })
  async create(@Body() createCatDto: CreateCatDto): Promise<ApiResponse<Cat>> {
    const result = await this.catsService.create(createCatDto);
    return ApiResponse.success(result, '新增成功');
  }

  @Put(':id')
  @ApiOperation({ summary: '更新猫咪（PC后台）' })
  async update(
    @Param('id') id: number,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<ApiResponse<Cat>> {
    const result = await this.catsService.update(id, updateCatDto);
    return ApiResponse.success(result, '修改成功');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除猫咪（PC后台）' })
  async remove(@Param('id') id: number): Promise<ApiResponse> {
    await this.catsService.remove(id);
    return ApiResponse.success(null, '删除成功');
  }
}
