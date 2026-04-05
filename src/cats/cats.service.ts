/**
 * ============================================================
 * 猫咪服务（Service）- 业务逻辑层
 * ============================================================
 *
 * 什么是 Service？
 * Service 负责处理所有的"业务逻辑"（Business Logic），
 * 它是 Controller 和数据之间的桥梁：
 *
 *   Controller（接收请求）→ Service（处理逻辑）→ 数据库/外部服务
 *
 * 为什么需要 Service？
 * - 保持 Controller 简洁（只负责路由分发）
 * - 业务逻辑集中，便于维护和测试
 * - 实现关注点分离（Separation of Concerns）
 *
 * 依赖注入（DI）：
 * @Injectable() 装饰器告诉 NestJS：此类需要被 NestJS 容器管理，
 * 可以在其他类（如 Controller）的构造函数中自动注入实例。
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import type { Cat } from './entities/cat.entity';
import type { CreateCatDto } from './dto/create-cat.dto';
import type { UpdateCatDto } from './dto/update-cat.dto';

@Injectable() // 👈 装饰器：声明此类由 NestJS IoC 容器管理，可被注入
export class CatsService {
  /**
   * 内存数组模拟"数据库表"
   * 每次服务器重启数据会清空（真实项目会用数据库持久化）
   */
  private cats: Cat[] = [
    // 初始化两条示例数据，让你启动后就有数据可看
    {
      id: '1',
      name: 'Tom',
      age: 3,
      breed: 'orange',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Luna',
      age: 2,
      breed: 'black',
      createdAt: new Date().toISOString(),
    },
  ];

  /**
   * 创建一只猫咪（C - Create）
   * @param createCatDto 客户端传来的创建数据
   * @returns 创建后的猫咪对象（含自动生成的 id）
   */
  create(createCatDto: CreateCatDto): Cat {
    const cat: Cat = {
      id: Date.now().toString(), // 简单生成 ID（生产环境建议用 uuid）
      createdAt: new Date().toISOString(),
      ...createCatDto, // 把 DTO 的字段展开合并进来
    };
    this.cats.push(cat);
    return cat;
  }

  /**
   * 获取所有猫咪（R - Read All）
   * @returns 猫咪数组
   */
  findAll(): Cat[] {
    return this.cats;
  }

  /**
   * 根据 ID 获取一只猫咪（R - Read One）
   * @param id 猫咪 ID
   * @returns 猫咪对象
   * @throws NotFoundException 如果找不到对应 ID 的猫咪
   */
  findOne(id: string): Cat {
    // find() 返回找到的元素，找不到返回 undefined
    const cat = this.cats.find((c) => c.id === id);
    if (!cat) {
      // NestJS 标准做法：找不到就抛异常，框架统一处理返回 404
      throw new NotFoundException(`ID 为 ${id} 的猫咪不存在`);
    }
    return cat;
  }

  /**
   * 更新猫咪信息（U - Update）
   * 使用部分更新策略：只更新传入的字段，未传字段保持原值
   * @param id 猫咪 ID
   * @param updateCatDto 要更新的字段
   * @returns 更新后的猫咪对象
   * @throws NotFoundException 如果找不到对应 ID 的猫咪
   */
  update(id: string, updateCatDto: UpdateCatDto): Cat {
    const index = this.cats.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`ID 为 ${id} 的猫咪不存在`);
    }
    // 保留原对象，只覆盖 updateCatDto 中传入的字段
    this.cats[index] = { ...this.cats[index], ...updateCatDto };
    return this.cats[index];
  }

  /**
   * 删除一只猫咪（D - Delete）
   * @param id 猫咪 ID
   * @throws NotFoundException 如果找不到对应 ID 的猫咪
   */
  remove(id: string): void {
    const index = this.cats.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`ID 为 ${id} 的猫咪不存在`);
    }
    // splice(index, 1) 从 index 位置删除 1 个元素
    this.cats.splice(index, 1);
  }
}
