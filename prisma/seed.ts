/**
 * ============================================================
 * 数据库种子文件（Seed）
 * ============================================================
 *
 * 什么是 Seed（种子数据）？
 * Seed 是数据库迁移/创建后自动填充的"初始测试数据"。
 * 作用：
 *   - 开发时快速有数据可测试
 *   - 确保每个开发环境的初始数据一致
 *   - CI/CD 自动化部署时填充数据
 *
 * Prisma Seed 工作流程：
 *   1. 迁移数据库（prisma migrate dev）
 *   2. 生成 PrismaClient（prisma generate）
 *   3. 运行种子（npm run prisma:seed）
 *   4. 数据进入数据库！
 */

import { PrismaClient } from '@prisma/client';

// 初始化 PrismaClient 实例
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始填充种子数据...');

  // ========================================
  // 清空旧数据（可选，确保每次 seed 都是干净状态）
  // ========================================
  await prisma.cat.deleteMany(); // DELETE FROM cats
  console.log('🗑️  已清空 cats 表');

  // ========================================
  // 插入种子数据
  // ========================================
  const tom = await prisma.cat.create({
    data: {
      name: 'Tom',
      age: 3,
      breed: 'orange',
    },
  });
  console.log(`✅ 创建猫咪: ${tom.name} (ID: ${tom.id})`);

  const luna = await prisma.cat.create({
    data: {
      name: 'Luna',
      age: 2,
      breed: 'black',
    },
  });
  console.log(`✅ 创建猫咪: ${luna.name} (ID: ${luna.id})`);

  const mittens = await prisma.cat.create({
    data: {
      name: 'Mittens',
      age: 4,
      breed: 'white',
    },
  });
  console.log(`✅ 创建猫咪: ${mittens.name} (ID: ${mittens.id})`);

  console.log('🎉 种子数据填充完成！');
}

main()
  .catch((e) => {
    console.error('❌ 种子数据填充失败:', e);
    process.exit(1); // 进程退出码 1 表示异常退出
  })
  .finally(async () => {
    // 关闭数据库连接
    await prisma.$disconnect();
    console.log('🔌 数据库连接已关闭');
  });
