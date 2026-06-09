/**
 * ============================================================
 * 数据库种子文件（Seed）
 * ============================================================
 *
 * 包含：
 * - 3 只初始猫咪
 * - 20 名学生
 * - 1 个管理员账户（admin / 123456）
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const students = [
  { name: '张伟', age: 15, gender: '男', grade: '高一', className: '1班', phone: '13800001001', address: '北京市朝阳区建国路1号' },
  { name: '李娜', age: 14, gender: '女', grade: '高一', className: '2班', phone: '13800001002', address: '上海市浦东新区世纪大道200号' },
  { name: '王浩', age: 16, gender: '男', grade: '高二', className: '1班', phone: '13800001003', address: '广州市天河区珠江新城50号' },
  { name: '刘洋', age: 15, gender: '女', grade: '高一', className: '3班', phone: '13800001004', address: '深圳市南山区科技园南区8栋' },
  { name: '陈静', age: 17, gender: '女', grade: '高二', className: '2班', phone: '13800001005', address: '杭州市西湖区文二路100号' },
  { name: '杨帆', age: 16, gender: '男', grade: '高二', className: '3班', phone: '13800001006', address: '成都市高新区天府大道300号' },
  { name: '赵磊', age: 15, gender: '男', grade: '高一', className: '1班', phone: '13800001007', address: '武汉市洪山区珞喻路88号' },
  { name: '孙颖', age: 14, gender: '女', grade: '高一', className: '4班', phone: '13800001008', address: '南京市鼓楼区中山路120号' },
  { name: '周强', age: 17, gender: '男', grade: '高三', className: '1班', phone: '13800001009', address: '西安市雁塔区科技路66号' },
  { name: '吴晓', age: 16, gender: '女', grade: '高二', className: '1班', phone: '13800001010', address: '重庆市渝北区新南路200号' },
  { name: '郑鑫', age: 15, gender: '男', grade: '高一', className: '2班', phone: '13800001011', address: '天津市南开区卫津路30号' },
  { name: '王芳', age: 17, gender: '女', grade: '高三', className: '2班', phone: '13800001012', address: '苏州市姑苏区干将路666号' },
  { name: '刘海', age: 16, gender: '男', grade: '高二', className: '4班', phone: '13800001013', address: '长沙市岳麓区麓山路88号' },
  { name: '陈晨', age: 15, gender: '女', grade: '高一', className: '5班', phone: '13800001014', address: '郑州市金水区花园路100号' },
  { name: '黄坤', age: 17, gender: '男', grade: '高三', className: '3班', phone: '13800001015', address: '济南市历下区泉城路50号' },
  { name: '林敏', age: 16, gender: '女', grade: '高二', className: '2班', phone: '13800001016', address: '青岛市市南区香港中路120号' },
  { name: '徐鹏', age: 15, gender: '男', grade: '高一', className: '1班', phone: '13800001017', address: '厦门市思明区环岛路180号' },
  { name: '马丽', age: 17, gender: '女', grade: '高三', className: '1班', phone: '13800001018', address: '大连市中山区人民路30号' },
  { name: '朱强', age: 16, gender: '男', grade: '高二', className: '5班', phone: '13800001019', address: '沈阳市和平区三好街66号' },
  { name: '胡雪', age: 15, gender: '女', grade: '高一', className: '3班', phone: '13800001020', address: '哈尔滨市南岗区红军街88号' },
];

async function main() {
  console.log('开始填充种子数据...');

  // 清空所有表（按依赖顺序）
  await prisma.user.deleteMany();
  await prisma.cat.deleteMany();
  await prisma.student.deleteMany();

  // 1. 创建管理员账户
  const hashedPassword = await bcrypt.hash('123456', 10);
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log(`创建管理员: ${admin.username} (ID: ${admin.id}, 密码: 123456)`);

  // 2. 创建普通用户
  const user = await prisma.user.create({
    data: {
      username: 'user1',
      password: hashedPassword,
      role: 'user',
    },
  });
  console.log(`创建普通用户: ${user.username} (ID: ${user.id}, 密码: 123456)`);

  // 3. 创建猫咪
  const catNames = [
    { name: 'Tom', age: 3, breed: 'orange' },
    { name: 'Luna', age: 2, breed: 'black' },
    { name: 'Mittens', age: 4, breed: 'white' },
  ];
  for (const cat of catNames) {
    const created = await prisma.cat.create({ data: cat });
    console.log(`创建猫咪: ${created.name} (ID: ${created.id})`);
  }

  // 4. 创建学生
  for (const s of students) {
    const created = await prisma.student.create({ data: s });
    console.log(`创建学生: ${created.name} (ID: ${created.id})`);
  }

  console.log(`\n种子数据填充完成！`);
  console.log(`- 管理员账户: admin / 123456`);
  console.log(`- 普通用户: user1 / 123456`);
}

main()
  .catch((e) => {
    console.error('种子数据填充失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
