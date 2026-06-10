/**
 * ============================================================
 * 学生控制器（StudentsController）- 路由处理层
 * ============================================================
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
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/create-student.dto';
import { QueryStudentDto } from './dto/pagination.dto';
import type { Student } from '@prisma/client';
import type { PaginatedResult } from './students.service';
import { ApiResponse } from '../common/api-response';

/**
 * 学生模块 API 文档
 * @description 提供学生的增删改查及分页查询接口
 */
@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
   * 分页 + 条件查询学生列表
   *
   * 支持按姓名（模糊）、年级（精确）、班级（精确）筛选
   */
  @Post('page')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '分页查询学生列表' })
  async findPage(
    @Body() query: QueryStudentDto,
  ): Promise<ApiResponse<PaginatedResult<Student>>> {
    const result = await this.studentsService.findPage(query);
    return ApiResponse.success(result, '查询成功');
  }

  /**
   * 根据 ID 获取单个学生
   */
  @Get(':id')
  @ApiOperation({ summary: '根据 ID 获取单个学生' })
  async findOne(@Param('id') id: number): Promise<ApiResponse<Student>> {
    const result = await this.studentsService.findOne(id);
    return ApiResponse.success(result, '查询成功');
  }

  /**
   * 创建新学生
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '创建新学生' })
  async create(@Body() dto: CreateStudentDto): Promise<ApiResponse<Student>> {
    const result = await this.studentsService.create(dto);
    return ApiResponse.success(result, '新增成功');
  }

  /**
   * 更新学生信息（支持部分字段更新）
   */
  @Put(':id')
  @ApiOperation({ summary: '更新学生信息' })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateStudentDto,
  ): Promise<ApiResponse<Student>> {
    const result = await this.studentsService.update(id, dto);
    return ApiResponse.success(result, '修改成功');
  }

  /**
   * 删除学生
   */
  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '删除学生' })
  async remove(@Param('id') id: number): Promise<ApiResponse> {
    await this.studentsService.remove(id);
    return ApiResponse.success(null, '删除成功');
  }
}
