import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/create-student.dto';
import { QueryStudentDto } from './dto/pagination.dto';
import type { Student } from '@prisma/client';
import type { PaginatedResult } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('list')
  @HttpCode(HttpStatus.OK)
  async findPage(@Body() query: QueryStudentDto): Promise<PaginatedResult<Student>> {
    return await this.studentsService.findPage(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Student> {
    return await this.studentsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateStudentDto): Promise<Student> {
    return await this.studentsService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
  ): Promise<Student> {
    return await this.studentsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return await this.studentsService.remove(id);
  }
}
