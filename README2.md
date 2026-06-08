## 学生数据插入到数据库流程
> 数据通过 Prisma Seed 机制插入数据库，整个流程如下：
>
> ## 1. 定义数据模型（schema.prisma）
>
> 在 `prisma/schema.prisma` 中定义了 `Student` 模型后，Prisma 会自动将模型映射为 MySQL 数据表：
>
> model Student {
>
>   id        String   @id @default(cuid())
>
>   name      String
>
>   age       Int
>
>   gender    String
>
>   grade     String
>
>   className String
>
>   phone     String
>
>   address   String
>
>   createdAt DateTime @default(now())
>
>   updatedAt DateTime @updatedAt
>
> }
>
> 这对应 MySQL 中一张 `Student` 表，每个字段对应一列。
>
> ## 2. 写入种子脚本（prisma/seed.ts）
>
> const students = [
>
>   { name: '张伟', age: 15, gender: '男', grade: '高一', className: '1班', phone: '13800001001', address: '北京市朝阳区建国路1号' },
>
>   *// ... 20条数据*
>
> ];
>
> async function main() {
>
>   *// 清空旧数据*
>
>   await prisma.student.deleteMany();
>
>   *// 逐条插入*
>
>   for (const s of students) {
>
> ​    const created = await prisma.student.create({ data: s });
>
> ​    console.log(`创建学生: ${created.name}`);
>
>   }
>
> }
>
> ## 3. 运行 seed 脚本
>
> 通过 `npx ts-node prisma/seed.ts` 执行，Prisma Client（`prisma.student.create`）底层生成 SQL：
>
> INSERT INTO Student (id, name, age, gender, grade, className, phone, address, createdAt, updatedAt)
>
> VALUES ('cmq4wlqds0003e2ugjcuzub9j', '张伟', 15, '男', '高一', '1班', '13800001001', '北京市朝阳区建国路1号', NOW(), NOW());
>
> ## 核心原理
>
> Prisma 的工作方式是：
>
> 1. Schema 定义 → 告诉 Prisma 表结构是什么
> 2. Prisma Client → 根据 schema 自动生成带类型提示的数据库操作 API（`prisma.student.create`、`prisma.student.findMany` 等）
> 3. Seed 脚本 → 调用这些 API，将 TypeScript 对象映射为 SQL 语句执行到 MySQL
>
> 简单说：`seed.ts` 是一个普通的 TypeScript 脚本，通过 Prisma Client 把内存中的 JS 对象写入数据库，和用 Navicat 手动插入数据的效果一样，只是用代码自动化了。
