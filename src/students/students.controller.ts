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
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/create-student.dto';
import { QueryStudentDto } from './dto/pagination.dto';
import type { Student } from '@prisma/client';
import type { PaginatedResult } from './students.service';
import { ApiResponse } from '../common/api-response';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('page')
  @HttpCode(HttpStatus.OK)
  async findPage(
    @Body() query: QueryStudentDto,
  ): Promise<ApiResponse<PaginatedResult<Student>>> {
    const result = await this.studentsService.findPage(query);
    return ApiResponse.success(result, '查询成功');
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ApiResponse<Student>> {
    const result = await this.studentsService.findOne(id);
    return ApiResponse.success(result, '查询成功');
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: CreateStudentDto): Promise<ApiResponse<Student>> {
    const result = await this.studentsService.create(dto);
    return ApiResponse.success(result, '新增成功');
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateStudentDto,
  ): Promise<ApiResponse<Student>> {
    const result = await this.studentsService.update(id, dto);
    return ApiResponse.success(result, '修改成功');
  }

  @Post('delete/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number): Promise<ApiResponse> {
    await this.studentsService.remove(id);
    return ApiResponse.success(null, '删除成功');
  }
}
