import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/create-student.dto';
import { QueryStudentDto } from './dto/pagination.dto';
import { Student } from '@prisma/client';

export interface PaginatedResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPage(query: QueryStudentDto): Promise<PaginatedResult<Student>> {
    const { page = 1, pageSize = 10, name, grade, className } = query;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (name) {
      where.name = { contains: name };
    }
    if (grade) {
      where.grade = grade;
    }
    if (className) {
      where.className = className;
    }

    const [list, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      list,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) {
      throw new NotFoundException(`ID 为 ${id} 的学生不存在`);
    }
    return student;
  }

  async create(dto: CreateStudentDto): Promise<Student> {
    return await this.prisma.student.create({
      data: { ...dto },
    });
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Student> {
    await this.findOne(id);
    return await this.prisma.student.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.student.delete({ where: { id } });
  }
}
