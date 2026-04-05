/**
 * ============================================================
 * 猫咪实体（Entity）
 * ============================================================
 *
 * 什么是 Entity？
 * Entity（实体）是对应数据库"表"的 TypeScript 类。
 * 这里我们用 TypeScript Interface 来定义猫咪的数据结构，
 * 因为在 Service 中我们用内存数组模拟数据库（暂时不连真实数据库）。
 *
 * 当你学习到数据库阶段时，会改用 @Entity() 装饰器的类来定义真实表结构。
 *
 * 命名建议：
 * - Interface 前面加 I 或不加（NestJS 社区倾向不加，直接用名字）
 * - 文件名用 kebab-case：cat.entity.ts
 */
export interface Cat {
  /** 猫咪唯一标识 ID（字符串类型，方便后续替换为 UUID） */
  id: string;
  /** 猫咪名字 */
  name: string;
  /** 猫咪年龄（岁） */
  age: number;
  /** 猫咪品种 */
  breed: string;
  /** 创建时间（ISO 字符串） */
  createdAt: string;
}
