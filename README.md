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
7. [第三阶段：进阶功能详解](#第三阶段进阶功能详解jwt-认证守卫-管道-拦截器-异常过滤器)
8. [常用命令](#常用命令)

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

### 第三阶段：进阶（已完成）

- [x] 认证与授权（JWT、Passport）
- [x] 守卫（Guards）- 权限控制
- [x] 管道（Pipes）- 数据验证和转换
- [x] 拦截器（Interceptors）- 响应包装
- [x] 异常过滤器（Exception Filters）- 统一错误处理
- [x] Swagger / OpenAPI 文档

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

## 第三阶段：进阶功能详解（JWT 认证、守卫、管道、拦截器、异常过滤器）

### 架构概览

```
HTTP 请求
    ↓
[异常过滤器] → 全局捕获异常，统一 { code, message, data } 格式
    ↓
[守卫]       → JwtAuthGuard 验证 Token → RolesGuard 检查角色
    ↓
[管道]       → ValidationPipe 验证 DTO → ParseIntPipe 转换参数
    ↓
[拦截器]     → HttpInterceptor 记录请求日志
    ↓
[Controller] → 处理路由，调用 Service
    ↓
[Service]    → 业务逻辑
    ↓
[Prisma]     → 数据库操作
```

---

### 1. 认证与授权（JWT + Passport）

#### 核心概念

| 概念 | 说明 |
|------|------|
| **JWT** | JSON Web Token，无状态的 Token 认证 |
| **Passport** | Node.js 认证中间件，封装了所有主流认证策略 |
| **Bearer Token** | 请求头 `Authorization: Bearer <token>` |

#### JWT 认证流程

```
客户端登录:
POST /auth/login { username, password }
    ↓
LocalStrategy 验证用户名 + 密码（bcrypt 比对）
    ↓
验证通过 → AuthService.login() 签发 JWT
    ↓
返回 { accessToken, tokenType, expiresIn, user }

后续请求:
GET /api/cats (带 Authorization: Bearer <token>)
    ↓
JwtStrategy 从 Token 解析 payload（sub=用户ID, username, role）
    ↓
request.user = { id, username, role }
    ↓
守卫 / 控制器中使用 request.user
```

#### 依赖说明

```bash
npm install @nestjs/jwt @nestjs/passport passport-jwt passport-local
npm install -D @types/passport-jwt @types/passport-local
npm install bcrypt && npm install -D @types/bcrypt
```

#### 关键文件说明

| 文件 | 职责 |
|------|------|
| `src/auth/auth.service.ts` | JWT 签发（login） |
| `src/auth/auth.controller.ts` | 登录接口（/auth/login）、个人信息接口（/auth/profile） |
| `src/auth/jwt.strategy.ts` | JWT 验证策略（从 Token 解析用户） |
| `src/auth/local.strategy.ts` | 本地验证策略（用户名+密码验证） |
| `src/auth/jwt-auth.guard.ts` | JWT 守卫（验证 Token） |
| `src/auth/local-auth.guard.ts` | 本地认证守卫（验证用户名密码） |
| `src/auth/roles.guard.ts` | 角色守卫（检查用户角色） |
| `src/auth/roles.decorator.ts` | `@Roles()` 装饰器（标记接口所需角色） |
| `src/users/users.service.ts` | 用户 CRUD + 密码加密（bcrypt） |
| `src/users/users.controller.ts` | 用户管理接口（需管理员权限） |

#### 登录接口

```typescript
// POST /auth/login
// Body: { "username": "admin", "password": "123456" }
@Post('login')
@UseGuards(LocalAuthGuard) // ← 触发 LocalStrategy 验证
async login(@Body() loginDto: LoginDto, @Request() req) {
  return this.authService.login(req.user);
}
// 响应: { code: 200, message: "登录成功", data: { accessToken, user, ... } }
```

#### 受保护接口示例

```typescript
// GET /auth/profile
@Get('profile')
@UseGuards(JwtAuthGuard) // ← 需要携带有效 JWT
async getProfile(@Request() req) {
  return ApiResponse.success(req.user, '查询成功');
}
```

---

### 2. 守卫（Guards）

守卫是 `@Injectable()` 类，实现 `CanActivate` 接口，决定请求是否能继续。

#### JwtAuthGuard（JWT 验证守卫）

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
// 继承 Passport 的 AuthGuard
// 自动从 Header 提取 Bearer Token 并调用 JwtStrategy.validate()
```

#### RolesGuard（角色权限守卫）

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // 1. 从 @Roles() 装饰器读取所需角色
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. 从 request.user 读取当前用户角色
    const user = context.switchToHttp().getRequest().user;

    // 3. 检查权限
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('权限不足，需要管理员权限');
    }
    return true;
  }
}
```

#### 使用守卫

```typescript
@Controller('cats')
@UseGuards(JwtAuthGuard, RolesGuard) // 先验证登录，再检查角色
@Roles('admin') // 只有 admin 可以访问
export class CatsController {}

// 链式守卫
@Get(':id')
@UseGuards(JwtAuthGuard) // 仅需登录
async findOne(@Param('id') id: string) {}
```

---

### 3. 管道（Pipes）

管道是 `@Injectable()` 类，实现 `PipeTransform` 接口，用于**转换**或**验证**数据。

#### 内置管道

| 管道 | 作用 | 示例 |
|------|------|------|
| `ValidationPipe` | DTO 验证（已在 main.ts 全局配置） | 自动验证 `@IsString()` 等 |
| `ParseIntPipe` | 字符串 → 整数 | `@Param('id', ParseIntPipe)` |
| `ParseBoolPipe` | 字符串 → 布尔值 | `@Query('active', ParseBoolPipe)` |
| `DefaultValuePipe` | 提供默认值 | `@Query('page', new DefaultValuePipe(1))` |

#### 自定义管道示例

```typescript
// 正整数管道：参数必须是正整数
@Injectable()
export class PositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val) || val <= 0) {
      throw new BadRequestException(`参数 "${metadata.data}" 必须是正整数`);
    }
    return val;
  }
}

// 使用
@Get(':id')
findOne(@Param('id', new PositiveIntPipe()) id: number) {}
```

---

### 4. 拦截器（Interceptors）

拦截器实现 `NestInterceptor` 接口，使用**洋葱模型**包裹请求处理。

#### 洋葱模型

```
请求 → Guard → Pipe → INTERCEPTOR(请求前) → Controller → Service
                                              ↑
              ← INTERCEPTOR(响应后) ←────────┘
```

#### 使用示例

```typescript
@Injectable()
export class HttpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url } = context.switchToHttp().getRequest();
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        console.log(`[${method}] ${url} - ${Date.now() - now}ms`);
      }),
    );
  }
}

// 全局注册（在 main.ts）
app.useGlobalInterceptors(new HttpInterceptor());
```

---

### 5. 异常过滤器（Exception Filters）

异常过滤器捕获处理过程中的所有异常，返回统一格式的错误响应。

#### 为什么需要？

1. NestJS 默认异常格式不统一
2. 前端需要一个统一的错误响应格式
3. 可以记录日志、过滤敏感信息

#### 统一错误响应格式

```json
{
  "code": 400,
  "message": "用户名不能为空",
  "data": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 核心代码

```typescript
@Catch() // 捕获所有异常
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      // HttpException：400/401/403/404/500 等
      const status = exception.getStatus();
      const message = exception.getResponse();
      response.status(status).json({ code: status, message, data: null });
    } else {
      // 未知异常
      response.status(500).json({
        code: 500,
        message: '服务器内部错误，请稍后重试',
        data: null,
      });
    }
  }
}
```

---

### 6. 认证相关 API

#### 认证接口

| 方法 | 路径 | 说明 | 需要认证 |
|------|------|------|---------|
| POST | `/auth/login` | 用户登录 | 否 |
| GET | `/auth/profile` | 获取当前用户信息 | 是（JWT） |

#### 用户接口

| 方法 | 路径 | 说明 | 需要认证 |
|------|------|------|---------|
| POST | `/users` | 注册用户 | 否 |
| GET | `/users` | 获取所有用户 | 是（admin） |
| GET | `/users/:id` | 获取单个用户 | 是（admin） |
| PUT | `/users/:id` | 更新用户 | 是（admin） |
| DELETE | `/users/:id` | 删除用户 | 是（admin） |

#### 默认账户

| 用户名 | 密码 | 角色 |
|--------|------|------|
| `admin` | `123456` | admin（管理员） |
| `user1` | `123456` | user（普通用户） |

---

### 7. JWT 配置

在 `.env` 中配置：

```env
JWT_SECRET=nest-mini-jwt-secret-key-2024-production
```

> 生产环境务必使用强密钥（至少 32 字符），建议 64 字符，并定期更换。

---

### 8. Swagger 认证配置

1. 启动服务：`npm run start:dev`
2. 访问：`http://localhost:3011/api`
3. 点击右上角 **Authorize** 按钮
4. 在输入框中粘贴 JWT Token（不包含 "Bearer " 前缀）
5. 点击 **Authorize** 确认
6. 之后所有接口请求会自动携带认证头

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

> 学习愉快！如果遇到问题，查看 [NestJS 官方文档](https://docs.nestjs.com)
