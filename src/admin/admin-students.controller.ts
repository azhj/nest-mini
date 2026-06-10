/**
 * ============================================================
 * PC后台学生控制器（AdminStudentsController）
 * ============================================================
 *
 * PC后台接口：所有路由自动加 /admin 前缀
 *
 * 接口设计：
 * POST /admin/students/page    - 分页查询学生列表
 * GET  /admin/students/:id     - 获取单个学生详情
 * POST /admin/students         - 创建学生
 * PUT  /admin/students/:id     - 更新学生
 * POST /admin/students/delete/:id - 删除学生
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService, PaginatedResult } from '../app/students/students.service';
import { CreateStudentDto, UpdateStudentDto } from '../app/students/dto/create-student.dto';
import { QueryStudentDto } from '../app/students/dto/pagination.dto';
import type { Student } from '@prisma/client';
import { ApiResponse } from '../app/common/api-response';
import { JwtAuthGuard } from '../app/auth/jwt-auth.guard';
import { RolesGuard } from '../app/auth/roles.guard';
import { Roles } from '../app/auth/roles.decorator';

@ApiTags('admin-students')
@Controller('admin/students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminStudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('page')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '分页查询学生列表（PC后台）' })
  async findPage(
    @Body() query: QueryStudentDto,
  ): Promise<ApiResponse<PaginatedResult<Student>>> {
    const result = await this.studentsService.findPage(query);
    return ApiResponse.success(result, '查询成功');
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个学生详情（PC后台）' })
  async findOne(@Param('id') id: number): Promise<ApiResponse<Student>> {
    const result = await this.studentsService.findOne(id);
    return ApiResponse.success(result, '查询成功');
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '创建学生（PC后台）' })
  async create(
    @Body() dto: CreateStudentDto,
  ): Promise<ApiResponse<Student>> {
    const result = await this.studentsService.create(dto);
    return ApiResponse.success(result, '新增成功');
  }

  @Put(':id')
  @ApiOperation({ summary: '更新学生（PC后台）' })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateStudentDto,
  ): Promise<ApiResponse<Student>> {
    const result = await this.studentsService.update(id, dto);
    return ApiResponse.success(result, '修改成功');
  }

  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除学生（PC后台）' })
  async remove(@Param('id') id: number): Promise<ApiResponse> {
    await this.studentsService.remove(id);
    return ApiResponse.success(null, '删除成功');
  }
}
