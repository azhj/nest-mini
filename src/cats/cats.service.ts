/**
 * ============================================================
 * 猫咪服务（Service）- 业务逻辑层 + Prisma 数据库操作
 * ============================================================
 *
 * 重大升级：本次修改将数据从"内存数组"迁移到"真实 MySQL 数据库"
 *
 * 核心变化：
 *   Before: private cats: Cat[] = []  ← 内存数组，服务器重启数据丢失
 *   After:  PrismaService              ← MySQL 数据库，数据持久化
 *
 * Prisma 在 Service 中的使用方式：
 *   this.prisma.cat.create()   → 插入数据
 *   this.prisma.cat.findMany() → 查询所有
 *   this.prisma.cat.findUnique() → 查询单个
 *   this.prisma.cat.update()   → 更新数据
 *   this.prisma.cat.delete()   → 删除数据
 *
 * Prisma 的操作都是"链式"的，类似 jQuery 语法：
 *   this.prisma.cat.findMany({ where: { age: { gt: 2 } } })
 *
 * 注意：所有 Prisma 操作都是异步的，必须用 await
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateCatDto } from './dto/create-cat.dto';
import type { UpdateCatDto } from './dto/update-cat.dto';
// Prisma 在运行时生成的类型（数据库表结构）
// 注意：这是 Prisma 根据 schema.prisma 自动生成的类型，不是我们手写的
import type { Cat } from '@prisma/client';

@Injectable()
export class CatsService {
  /**
   * 注入 PrismaService
   * 通过 PrismaService 可以访问所有 Prisma 操作方法
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 创建一只猫咪（C - Create）
   *
   * Prisma 操作：this.prisma.cat.create()
   * - data: 要插入的数据
   * - Prisma 自动生成 id / createdAt / updatedAt（由 schema.prisma 定义）
   *
   * @param createCatDto 客户端传来的创建数据（已通过 ValidationPipe 验证）
   * @returns 创建后的猫咪对象
   */
  async create(createCatDto: CreateCatDto): Promise<Cat> {
    return await this.prisma.cat.create({
      // data 接收一个对象，字段名和 schema.prisma 中定义的完全一致
      // Prisma 会自动验证字段类型，处理默认值
      data: {
        name: createCatDto.name,
        age: createCatDto.age,
        breed: createCatDto.breed,
      },
    });
  }

  /**
   * 获取所有猫咪（R - Read All）
   *
   * Prisma 操作：this.prisma.cat.findMany()
   *
   * 注意：
   * - findMany() 即使没有数据也返回空数组 []，不会报错
   * - 跟之前内存数组的 findAll() 行为一致，但数据来自数据库
   *
   * @returns 猫咪数组
   */
  async findAll(): Promise<Cat[]> {
    return await this.prisma.cat.findMany({
      // 排序：按创建时间倒序，最新创建的在前
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 根据 ID 获取一只猫咪（R - Read One）
   *
   * Prisma 操作：this.prisma.cat.findUnique()
   *
   * Prisma 查找单个记录有两种方式：
   *   - findUnique()   → 用唯一字段查找（如 id、email）
   *   - findFirst()    → 查找满足条件的第一条（用 where）
   *
   * 这里用 findUnique({ where: { id } })，等价于 findFirst({ where: { id } })
   *
   * @param id 猫咪 ID（Prisma cuid 格式）
   * @returns 猫咪对象
   * @throws NotFoundException 如果找不到
   */
  async findOne(id: string): Promise<Cat> {
    const cat = await this.prisma.cat.findUnique({
      where: { id },
    });
    if (!cat) {
      throw new NotFoundException(`ID 为 ${id} 的猫咪不存在`);
    }
    return cat;
  }

  /**
   * 更新猫咪信息（U - Update）
   *
   * Prisma 操作：this.prisma.cat.update()
   *
   * update() 需要两个参数：
   *   - where: 定位要更新的记录
   *   - data: 要更新的字段（部分更新，未传字段保持原值）
   *
   * @param id 猫咪 ID
   * @param updateCatDto 要更新的字段（都是可选的）
   * @returns 更新后的猫咪对象
   * @throws NotFoundException 如果找不到对应 ID
   */
  async update(id: string, updateCatDto: UpdateCatDto): Promise<Cat> {
    // 先检查是否存在，不存在则抛异常
    await this.findOne(id);

    return await this.prisma.cat.update({
      where: { id },
      data: {
        // 只更新传入的字段：使用展开运算符，未传字段不更新
        // 等价于：name: updateCatDto.name ?? 不更新
        ...(updateCatDto.name && { name: updateCatDto.name }),
        ...(updateCatDto.age !== undefined && { age: updateCatDto.age }),
        ...(updateCatDto.breed && { breed: updateCatDto.breed }),
      },
    });
  }

  /**
   * 删除一只猫咪（D - Delete）
   *
   * Prisma 操作：this.prisma.cat.delete()
   *
   * @param id 猫咪 ID
   * @throws NotFoundException 如果找不到
   */
  async remove(id: string): Promise<void> {
    // 先检查是否存在
    await this.findOne(id);
    // 再删除（或者反过来也行，delete 找不到会抛异常 P2025）
    await this.prisma.cat.delete({ where: { id } });
  }
}
