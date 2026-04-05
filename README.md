# NestJS 从零开始学习指南

> 本项目使用 NestJS v11 + TypeScript，带你从零掌握 NestJS 核心概念

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
├── src/
│   ├── main.ts                        # 应用入口，启动服务器
│   ├── app.module.ts                  # 根模块，组织所有模块
│   ├── cats/                          # Cats 功能模块（示例）
│   │   ├── cats.module.ts             # 模块定义
│   │   ├── cats.controller.ts         # 路由和请求处理
│   │   ├── cats.service.ts             # 业务逻辑
│   │   ├── dto/                       # 数据传输对象
│   │   │   └── create-cat.dto.ts      # 创建猫咪的 DTO
│   │   └── entities/
│   │       └── cat.entity.ts          # 实体（对应数据库表）
│   └── common/                        # 公共模块
│       └── filters/
│           └── http-exception.filter.ts  # 全局异常过滤器
├── test/                              # E2E 测试文件
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

### 第一阶段：基础（本文档覆盖）

- [x] 项目搭建
- [x] 模块、控制器、服务的基本结构
- [x] DTO 和数据验证
- [x] RESTful API 设计
- [x] 依赖注入原理

### 第二阶段：进阶

- [ ] 数据库集成（TypeORM / Prisma / Mongoose）
- [ ] 认证与授权（JWT、Passport）
- [ ] 守卫（Guards）- 权限控制
- [ ] 管道（Pipes）- 数据验证和转换
- [ ] 拦截器（Interceptors）- 响应包装
- [ ] 异常过滤器（Exception Filters）- 统一错误处理
- [ ] Swagger / OpenAPI 文档

### 第三阶段：高级

- [ ] GraphQL API
- [ ] WebSocket 实时通信
- [ ] 微服务架构
- [ ] 任务调度（Cron Jobs）
- [ ] 文件上传
- [ ] 单元测试 & E2E 测试
- [ ] Docker 部署

---

## 快速开始

### 安装依赖

```bash
cd nest-mini
npm install
```

### 启动开发服务器

```bash
# 开发模式（热重载）
npm run start:dev

# 生产模式
npm run start:prod

# 普通启动
npm run start
```

### 测试 API

启动后访问：`http://localhost:3000`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/cats` | 获取所有猫咪 |
| POST | `/cats` | 创建一只猫咪 |
| GET | `/cats/:id` | 根据 ID 获取猫咪 |
| PUT | `/cats/:id` | 更新猫咪信息 |
| DELETE | `/cats/:id` | 删除猫咪 |

---

## Cats 模块详解（第一个功能）

### 模块架构图

```
HTTP 请求
    ↓
[CatsController]     ← 接收请求、参数校验、路由分发
    ↓
[CatsService]        ← 业务逻辑、数据处理
    ↓
[Cat Entity]         ← 数据模型（模拟数据库表）
```

### 文件对应关系

| 文件 | 角色 | 关键词 |
|------|------|--------|
| `cats.controller.ts` | 路由处理器 | `@Get`, `@Post`, `@Put`, `@Delete` |
| `cats.service.ts` | 业务逻辑 | 增删改查 |
| `cats.module.ts` | 模块组装 | `@Module` |
| `create-cat.dto.ts` | 数据格式 | `class-validator` 验证 |
| `cat.entity.ts` | 数据模型 | TypeScript 接口 |

### 重要代码解析

#### DTO（Data Transfer Object）

DTO 定义客户端发送数据的格式：

```typescript
export class CreateCatDto {
  @IsString()           // 必须是字符串
  @MinLength(1)         // 最小长度 1
  name: string;

  @IsInt()              // 必须是整数
  @Min(1)              // 最小值 1
  @Max(30)             // 最大值 30
  age: number;

  @IsString()
  @IsIn(['orange', 'black', 'white', 'brown', 'gray'])  // 枚举限制
  breed: string;
}
```

**为什么要用 DTO？**
1. **类型安全**：TypeScript 编译器帮你检查类型
2. **验证**：配合 `class-validator` 自动验证输入
3. **文档化**：一眼看出接口需要什么数据
4. **解耦**：内部数据模型和外部接口可以独立变化

#### 服务（Service）

服务使用内存数组模拟数据库，`private cats: Cat[] = []` 即"数据库表"：

```typescript
@Injectable()
export class CatsService {
  private cats: Cat[] = [];    // 模拟数据库表

  // C - Create
  create(createCatDto: CreateCatDto): Cat {
    const cat: Cat = {
      id: Date.now().toString(),  // 简单生成 ID
      ...createCatDto,
    };
    this.cats.push(cat);
    return cat;
  }

  // R - Read All
  findAll(): Cat[] {
    return this.cats;
  }

  // R - Read One
  findOne(id: string): Cat | undefined {
    return this.cats.find(cat => cat.id === id);
  }

  // U - Update
  update(id: string, updateCatDto: UpdateCatDto): Cat | undefined {
    const index = this.cats.findIndex(cat => cat.id === id);
    if (index === -1) return undefined;
    this.cats[index] = { ...this.cats[index], ...updateCatDto };
    return this.cats[index];
  }

  // D - Delete
  remove(id: string): boolean {
    const index = this.cats.findIndex(cat => cat.id === id);
    if (index === -1) return false;
    this.cats.splice(index, 1);
    return true;
  }
}
```

#### 控制器（Controller）

控制器接收 HTTP 请求并调用服务：

```typescript
@Controller('cats')              // 所有路由以 /cats 开头
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  // GET /cats
  @Get()
  findAll(): Cat[] {
    return this.catsService.findAll();
  }

  // GET /cats/:id
  @Get(':id')
  findOne(@Param('id') id: string): Cat {
    return this.catsService.findOne(id);
  }

  // POST /cats  +  @Body() 获取请求体
  @Post()
  create(@Body() createCatDto: CreateCatDto): Cat {
    return this.catsService.create(createCatDto);
  }

  // PUT /cats/:id  +  @Body() + @Param()
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCatDto: UpdateCatDto,
  ): Cat {
    return this.catsService.update(id, updateCatDto);
  }

  // DELETE /cats/:id
  @Delete(':id')
  remove(@Param('id') id: string): { success: boolean } {
    const success = this.catsService.remove(id);
    return { success };
  }
}
```

---

## 常用命令

```bash
# 启动
npm run start           # 普通启动
npm run start:dev       # 开发模式（热重载）← 最常用
npm run start:debug      # 调试模式
npm run start:prod       # 生产模式

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

现在你已经了解了 NestJS 的基本结构，可以：

1. **运行 `npm run start:dev`** 启动服务，用 Postman 或浏览器访问 `http://localhost:3000/cats`
2. **阅读 `src/cats/` 下的每个文件**，理解模块化的组织方式
3. **尝试修改代码**，比如添加新字段、新接口
4. **添加数据库**：安装 TypeORM + MySQL/PostgreSQL

---

> 学习愉快！如果遇到问题，查看 [NestJS 官方文档](https://docs.nestjs.com)
