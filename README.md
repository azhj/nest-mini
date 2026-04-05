# NestJS 从零开始学习指南

> 本项目使用 NestJS v11 + Prisma v6 + MySQL，带你从零掌握 NestJS 核心概念

---

## 目录

1. [什么是 NestJS？](#什么是-nestjs)
2. [项目结构说明](#项目结构说明)
3. [核心概念速览](#核心概念速览)
4. [学习路线图](#学习路线图)
5. [快速开始](#快速开始)
6. [Cats 模块详解（第一个功能）](#cats-模块详解第一个功能)
7. [常用命令](#常用命令)

---

## 什么是 NestJS？

NestJS 是一个用于构建高效、可扩展的 Node.js 服务端应用的框架。

### 核心特点

- **类 Angular 风格**：模块化、依赖注入、装饰器
- **TypeScript 原生**：完整类型支持
- **装饰器驱动**：用 `@Controller`、`@Injectable` 等装饰器声明式地组织代码
- **可扩展**：拥有庞大的生态系统（TypeORM、Prisma、Mongoose、GraphQL 等）
- **渐进式**：可以从简单到复杂，逐步深入

### 对比 Express/Koa

| 特性 | Express/Koa | NestJS |
|------|------------|--------|
| 组织结构 | 自由散漫 | 约定好的模块化 |
| 依赖注入 | 手动实现 | 内置支持 |
| 类型安全 | 可选 | 原生 TypeScript |
| 学习曲线 | 平缓 | 稍陡 |
| 适用场景 | 小项目 | 中大型项目 |

---

## 项目结构说明

```
nest-mini/
├── prisma/
│   ├── schema.prisma              # Prisma 数据模型定义（表结构）
│   └── seed.ts                    # 种子数据（初始测试数据）
├── src/
│   ├── main.ts                    # 应用入口，全局管道 + CORS
│   ├── app.module.ts              # 根模块，组织所有模块
│   ├── prisma/
│   │   ├── prisma.service.ts      # Prisma 数据库服务（连接管理）
│   │   └── prisma.module.ts       # Prisma 全局模块
│   └── cats/                      # Cats 功能模块
│       ├── cats.module.ts         # 模块定义
│       ├── cats.controller.ts     # 路由和请求处理
│       ├── cats.service.ts        # 业务逻辑（Prisma CRUD）
│       └── dto/                   # 数据传输对象
│           ├── create-cat.dto.ts  # 创建猫咪 DTO + 验证
│           └── update-cat.dto.ts  # 更新猫咪 DTO（字段全可选）
├── test/                          # E2E 测试文件
├── .env.example                   # 数据库连接配置示例
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## 核心概念速览

### 1. 模块（Module）

模块是组织应用代码的基本单位。每个模块是一个 `@Module` 装饰的类。

```typescript
@Module({
  imports: [],    // 引入其他模块
  controllers: [], // 该模块的控制器
  providers: [],   // 该模块的服务（可供注入）
  exports: []     // 导出给其他模块使用的服务
})
export class CatsModule {}
```

**根模块**（`AppModule`）是整个应用的入口，它汇总所有子模块。

### 2. 控制器（Controller）

控制器负责处理**请求**和**响应**。通过装饰器定义路由。

```typescript
@Controller('cats')           // 路由前缀 /cats
export class CatsController {
  @Get()                      // GET /cats
  findAll(): string {
    return '所有猫咪';
  }
}
```

### 3. 服务（Service）

服务包含**业务逻辑**，使用 `@Injectable()` 装饰器声明为可注入的。

```typescript
@Injectable()
export class CatsService {
  private cats: Cat[] = [];  // 模拟数据库

  create(cat: Cat): Cat {
    this.cats.push(cat);
    return cat;
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

### 4. 依赖注入（DI）

NestJS 的核心！控制器通过构造函数注入服务：

```typescript
@Controller()
export class CatsController {
  // NestJS 会自动实例化 CatsService 并注入
  constructor(private readonly catsService: CatsService) {}
}
```

### 5. 装饰器（Decorators）

NestJS 基于 Angular 的装饰器设计，常用装饰器：

| 装饰器 | 作用 |
|--------|------|
| `@Controller(path)` | 定义控制器路由前缀 |
| `@Get(path)` | GET 请求 |
| `@Post(path)` | POST 请求 |
| `@Put(path)` | PUT 请求 |
| `@Delete(path)` | DELETE 请求 |
| `@Body()` | 获取请求体 |
| `@Param(key?)` | 获取 URL 参数 |
| `@Query(key?)` | 获取查询参数 |
| `@Injectable()` | 声明为可注入的服务 |
| `@Module()` | 定义模块 |
| `@Inject()` | 手动注入依赖 |
| `@Optional()` | 可选依赖 |
| `@UseGuards()` | 使用守卫 |
| `@UsePipes()` | 使用管道 |
| `@UseInterceptors()` | 使用拦截器 |

---

## 学习路线图

### 第一阶段：基础（已完成）

- [x] 项目搭建
- [x] 模块、控制器、服务的基本结构
- [x] DTO 和数据验证
- [x] RESTful API 设计
- [x] 依赖注入原理

### 第二阶段：数据库集成（Prisma + MySQL）

- [x] 安装 Prisma + MySQL
- [x] 定义 Prisma Schema（数据模型）
- [x] 创建 Prisma 模块（连接管理）
- [x] CatsService 对接 Prisma（CRUD）
- [x] 数据库种子数据（Seed）

### 第三阶段：进阶

- [ ] 认证与授权（JWT、Passport）
- [ ] 守卫（Guards）- 权限控制
- [ ] 管道（Pipes）- 数据验证和转换
- [ ] 拦截器（Interceptors）- 响应包装
- [ ] 异常过滤器（Exception Filters）- 统一错误处理
- [ ] Swagger / OpenAPI 文档

### 第四阶段：高级

- [ ] GraphQL API
- [ ] WebSocket 实时通信
- [ ] 微服务架构
- [ ] 任务调度（Cron Jobs）
- [ ] 文件上传
- [ ] 单元测试 & E2E 测试
- [ ] Docker 部署

---

## 快速开始（Prisma + MySQL 版）

### 安装依赖

```bash
cd nest-mini
npm install
npx prisma generate     # 生成 Prisma 类型代码
```

### 配置 MySQL

```sql
-- 在 MySQL 命令行中执行
CREATE DATABASE nest_mini CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

编辑 `.env`，填入真实密码，然后运行迁移：

```bash
npx prisma migrate dev --name init    # 创建数据库表
npm run prisma:seed                   # 填充种子数据
```

### 启动开发服务器

```bash
npm run start:dev
```

### 测试 API

访问 `http://localhost:3000`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/cats` | 获取所有猫咪（来自 MySQL） |
| POST | `/cats` | 创建一只猫咪 |
| GET | `/cats/:id` | 根据 ID 获取猫咪 |
| PUT | `/cats/:id` | 更新猫咪信息 |
| DELETE | `/cats/:id` | 删除猫咪 |

> **可视化数据库**：运行 `npx prisma studio` 打开浏览器查看/编辑数据

---

## Cats 模块详解（Prisma 数据库版）

### 模块架构图

```
HTTP 请求
    ↓
[CatsController]     ← 接收请求、参数校验、路由分发
    ↓
[CatsService]       ← 业务逻辑
    ↓
[PrismaService]     ← 数据库操作（Prisma Client）
    ↓
[MySQL]             ← 真实数据库，数据持久化
```

### 文件对应关系

| 文件 | 角色 | 关键内容 |
|------|------|---------|
| `prisma.service.ts` | 数据库连接服务 | PrismaClient 管理、生命周期钩子 |
| `prisma.module.ts` | 全局数据库模块 | `@Global()` 声明 |
| `cats.controller.ts` | 路由处理器 | `@Get`, `@Post`, `@Put`, `@Delete` |
| `cats.service.ts` | 业务逻辑 | `this.prisma.cat.findMany()` 等 |
| `cats.module.ts` | 模块组装 | `@Module` |
| `create-cat.dto.ts` | 数据格式 | `class-validator` 验证 |
| `update-cat.dto.ts` | 更新格式 | 字段全 `IsOptional()` |

### 重要代码解析

#### PrismaService（数据库连接）

继承 PrismaClient 并实现生命周期接口，实现启动连接、关闭断开：

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();    // 启动时连接数据库
  }
  async onModuleDestroy() {
    await this.$disconnect(); // 关闭时断开连接
  }
}
```

#### 服务（Service）— 数据库版

所有方法改为 `async`，数据操作走 Prisma：

```typescript
@Injectable()
export class CatsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    return await this.prisma.cat.create({
      data: {
        name: createCatDto.name,
        age: createCatDto.age,
        breed: createCatDto.breed,
      },
    });
  }

  async findAll(): Promise<Cat[]> {
    return await this.prisma.cat.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Cat> {
    const cat = await this.prisma.cat.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException(`ID 为 ${id} 的猫咪不存在`);
    return cat;
  }

  async update(id: string, updateCatDto: UpdateCatDto): Promise<Cat> {
    await this.findOne(id);
    return await this.prisma.cat.update({
      where: { id },
      data: {
        ...(updateCatDto.name && { name: updateCatDto.name }),
        ...(updateCatDto.age !== undefined && { age: updateCatDto.age }),
        ...(updateCatDto.breed && { breed: updateCatDto.breed }),
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.cat.delete({ where: { id } });
  }
}
```

**核心变化**：内存数组 → `this.prisma.cat`，同步方法 → `async/await`

---

## Prisma + MySQL 数据库集成（第二步）

### 为什么选择 Prisma？

Prisma 是目前最现代化的 Node.js ORM，相比 TypeORM：

| 特性 | Prisma | TypeORM |
|------|--------|---------|
| 类型生成 | 自动生成完整 TS 类型 | 半自动 |
| Schema 设计 | DSL 语言，直观简洁 | 装饰器，侵入代码 |
| 迁移体验 | 清晰的 SQL diff | 同步式 |
| 查询语法 | 链式 API | Repository 模式 |
| 性能 | 优秀 | 优秀 |
| 学习曲线 | 平缓 | 较陡 |

**本项目使用 Prisma v6 + MySQL**（v7 刚发布，配置方式有较大变化，v6 更稳定适合学习）

---

### 完整操作步骤

#### 第 1 步：配置 MySQL 数据库

确保本地已安装 MySQL，并创建数据库：

```sql
CREATE DATABASE nest_mini CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 第 2 步：配置连接

复制 `.env.example` 为 `.env`，填入真实密码：

```bash
cp .env.example .env
```

编辑 `.env`，修改密码：

```env
DATABASE_URL="mysql://root:你的MySQL密码@localhost:3306/nest_mini"
```

#### 第 3 步：生成 Prisma Client

```bash
npx prisma generate
```

> 作用：根据 `prisma/schema.prisma` 生成 TypeScript 类型代码到 `node_modules/@prisma/client`

#### 第 4 步：创建数据库表（迁移）

```bash
npx prisma migrate dev --name init
```

> 作用：在 MySQL 中创建 `cats` 表，并生成迁移记录文件到 `prisma/migrations/`

**首次迁移后**，再次修改 schema 可用：

```bash
npx prisma migrate dev --name add_field_xxx
```

#### 第 5 步：填充种子数据

```bash
npm run prisma:seed
```

> 作用：向数据库插入 3 只初始猫咪（Tom、Luna、Mittens）

#### 第 6 步：启动服务器

```bash
npm run start:dev
```

访问 `http://localhost:3000/cats`，数据来自真实 MySQL！

---

### Prisma 架构解析

```
┌─────────────────────────────────────────────────────────────┐
│                      NestJS 应用                            │
│                                                             │
│   AppModule                                                  │
│     ├── PrismaModule (@Global 全局)                         │
│     │     └── PrismaService → PrismaClient → MySQL          │
│     └── CatsModule                                          │
│           ├── CatsController → 处理 HTTP 请求                 │
│           └── CatsService → 业务逻辑 + 数据库操作            │
└─────────────────────────────────────────────────────────────┘
```

**PrismaModule 为什么用 `@Global()`？**
数据库连接只需要建立一次，设为全局后所有模块都能直接注入 `PrismaService`，不需要每个模块都 import。

---

### Prisma CRUD 操作速查

在 `CatsService` 中，所有数据库操作通过 `this.prisma.cat` 访问：

| 操作 | Prisma 语法 |
|------|------------|
| 插入 | `this.prisma.cat.create({ data: {...} })` |
| 查询所有 | `this.prisma.cat.findMany()` |
| 查询单个 | `this.prisma.cat.findUnique({ where: { id } })` |
| 更新 | `this.prisma.cat.update({ where: { id }, data: {...} })` |
| 删除 | `this.prisma.cat.delete({ where: { id } })` |
| 条件查询 | `this.prisma.cat.findMany({ where: { age: { gte: 3 } } })` |
| 分页 | `this.prisma.cat.findMany({ skip: 10, take: 5 })` |
| 排序 | `this.prisma.cat.findMany({ orderBy: { createdAt: 'desc' } })` |

---

### Prisma 常用命令

```bash
npx prisma generate      # 生成 PrismaClient 类型代码（每次修改 schema 后都要跑）
npx prisma migrate dev   # 创建迁移 + 执行 SQL（开发用）
npx prisma migrate prod  # 执行迁移（生产用）
npx prisma db push       # 直接同步 schema 到数据库（不生成迁移文件，开发调试用）
npx prisma studio        # 打开可视化数据库管理界面（http://localhost:5555）
npm run prisma:seed      # 填充种子数据
npx prisma db pull       # 从现有数据库反向生成 schema.prisma
```

---

## 常用命令

```bash
# 启动
npm run start           # 普通启动
npm run start:dev       # 开发模式（热重载）← 最常用
npm run start:debug      # 调试模式
npm run start:prod       # 生产模式

# Prisma / 数据库
npx prisma generate      # 生成 PrismaClient 类型代码
npx prisma migrate dev   # 创建数据库迁移（开发用）
npx prisma db push       # 直接同步 schema 到数据库（不生成迁移文件）
npx prisma studio        # 可视化数据库管理（http://localhost:5555）
npm run prisma:seed      # 填充种子数据

# 测试
npm run test            # 单元测试
npm run test:watch       # 监听模式运行测试
npm run test:cov         # 测试覆盖率
npm run test:e2e         # 端到端测试

# 代码质量
npm run lint             # ESLint 检查
npm run format           # Prettier 格式化

# 构建
npm run build            # TypeScript 编译到 dist/
```

---

## 下一步

数据库集成已完成！现在你可以：

1. **配置 MySQL**：确保本地 MySQL 已启动，创建 `nest_mini` 数据库
2. **修改 `.env`**：填入真实密码后运行 `npm run start:dev`
3. **打开 Prisma Studio**：`npx prisma studio`，在浏览器中可视化查看和编辑数据
4. **尝试 CRUD**：用 Postman 测试增删改查接口
5. **下一步学习**：JWT 认证、守卫、管道、拦截器、异常过滤器等

> **Prisma 7 升级提示**：当前项目使用 Prisma v6（稳定版）。Prisma v7 已发布，改用 `prisma.config.ts` 配置数据源。如需升级请参考 [官方迁移指南](https://pris.ly/d/major-version-upgrade)

---

> 学习愉快！如果遇到问题，查看 [NestJS 官方文档](https://docs.nestjs.com)
