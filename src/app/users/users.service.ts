/**
 * ============================================================
 * 用户服务（UsersService）- 业务逻辑层
 * ============================================================
 *
 * 职责：
 * 1. 用户 CRUD 操作（依赖 PrismaService）
 * 2. 密码加密（bcrypt）
 * 3. 用户名唯一性检查
 *
 * 安全说明：
 * - 密码必须使用 bcrypt 加密存储，绝不存储明文密码
 * - 登录时对比 bcrypt 加密后的密码（不可逆）
 */

import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建用户（注册）
   *
   * 流程：
   * 1. 检查用户名是否已存在
   * 2. bcrypt 加密密码
   * 3. 写入数据库
   */
  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existing) {
      throw new ConflictException('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        role: 'user',
      },
    });
  }

  /** 查询所有用户 */
  async findAll() {
    return await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /** 根据 ID 查询用户 */
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`ID 为 ${id} 的用户不存在`);
    }
    return user;
  }

  /** 根据用户名查询用户（包含密码，用于登录验证） */
  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: { username },
    });
  }

  /** 更新用户 */
  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    const data: { password?: string; role?: string } = {};
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }
    if (dto.role) {
      data.role = dto.role;
    }

    return await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /** 删除用户 */
  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
  }

  /**
   * 密码验证（用于登录）
   *
   * @param password 明文密码
   * @param hashedPassword 数据库中的加密密码
   * @returns 密码是否匹配
   */
  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
