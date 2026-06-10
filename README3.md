# NestJS 学习总结

> 本文档基于 `nest-mini` 项目实践，整理已掌握的 NestJS 核心知识点、常用命令、代码结构，以及还需要继续深入的方向。

---

## 目录

1. [常用命令速查](#常用命令速查)
2. [项目代码结构](#项目代码结构)
3. [已掌握知识点汇总](#已掌握知识点汇总)
4. [还需继续学习的内容](#还需继续学习的内容)

---

## 常用命令速查

### 项目启动

```bash
# 开发模式（热重载）
npm run start:dev

# 普通启动
npm run start

# 调试模式
npm run start:debug

# 生产模式
npm run start:prod

# 构建 TypeScript
npm run build
```

### Prisma / 数据库

```bash
# 生成 PrismaClient 类型代码（每次修改 schema 后都要跑）
npx prisma generate

# 创建数据库迁移（开发用）
npx prisma migrate dev --name init
npx prisma migrate dev --name add_xxx  # 后续新增字段/表

# 执行迁移（生产用）
npx prisma migrate deploy

# 直接同步 schema 到数据库（不生成迁移文件，开发调试用）
npx prisma db push

# 可视化数据库管理界面（http://localhost:5555）
npx prisma studio

# 填充种子数据
npm run prisma:seed

# 从现有数据库反向生成 schema.prisma
npx prisma db pull
```

### 测试

```bash
npm run test           # 单元测试
npm run test:watch     # 监听模式运行测试
npm run test:cov       # 测试覆盖率报告
npm run test:e2e       # 端到端测试
```

### 代码质量

```bash
npm run lint           # ESLint 检查
npm run format         # Prettier 格式化
```

### NestJS CLI

```bash
# 创建新模块（带 controller、service）
nest g resource cats

# 创建单个文件
nest g controller cats
nest g service cats
nest g module cats
nest g guard jwt-auth
nest g guard roles
nest g decorator roles
nest g pipe validation
nest g interceptor logging
nest g filter http
nest g module auth
```

---

## 项目代码结构

### 整体目录

```
nest-mini/
├── prisma/
│   ├── schema.prisma          # 数据模型定义（表结构）
│   └── seed.ts                # 种子数据
├── src/
│   ├── main.ts                # 应用入口（全局管道 + CORS + Swagger）
│   ├── app.module.ts          # 根模块，组织所有模块
│   ├── common/                # 公共模块
│   │   ├── filters/           # 异常过滤器
│   │   ├── interceptors/      # 拦截器
│   │   ├── decorators/        # 自定义装饰器（@Roles 等）
│   │   └── response/          # 统一响应格式
│   ├── prisma/
│   │   ├── prisma.service.ts  # Prisma 数据库服务（连接管理）
│   │   └── prisma.module.ts   # Prisma 全局模块
│   ├── auth/                  # 认证模块
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts # 登录接口 /auth/login
│   │   ├── auth.service.ts    # JWT 签发
│   │   ├── jwt.strategy.ts    # JWT 验证策略
│   │   ├── local.strategy.ts  # 本地验证策略（用户名+密码）
│   │   ├── jwt-auth.guard.ts  # JWT 守卫
│   │   ├── local-auth.guard.ts
│   │   ├── roles.guard.ts     # 角色权限守卫
│   │   └── dto/
│   │       └── login.dto.ts
│   ├── users/                 # 用户管理模块
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts   # 用户 CRUD + 密码加密（bcrypt）
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       └── update-user.dto.ts
│   └── cats/                  # Cats 功能模块（示例）
│       ├── cats.module.ts
│       ├── cats.controller.ts  # 路由和请求处理
│       ├── cats.service.ts     # 业务逻辑（Prisma CRUD）
│       └── dto/
│           ├── create-cat.dto.ts
│           └── update-cat.dto.ts
├── test/                      # E2E 测试文件
├── .env.example               # 环境变量示例
├── package.json
├── tsconfig.json
└── nest-cli.json
```

### 每个功能模块的标准结构

```
模块名/
├── xxx.module.ts       # 模块定义（@Module 装饰器）
├── xxx.controller.ts   # 路由处理器（接收请求）
├── xxx.service.ts      # 业务逻辑（注入 PrismaService）
└── dto/                # 数据传输对象
    ├── create-xxx.dto.ts   # 创建 DTO + class-validator 验证
    └── update-xxx.dto.ts   # 更新 DTO（全字段可选）
```

### Prisma Schema 结构（每张表）

```prisma
model Cat {
  id        String   @id @default(cuid())  // 主键 + 默认生成 ID
  name      String                       // 字段
  age       Int?
  breed     String?
  createdAt DateTime @default(now())      // 创建时间（自动）
  updatedAt DateTime @updatedAt           // 更新时间（自动）
}
```

---

## 已掌握知识点汇总

### 第一阶段：基础

| 知识点 | 掌握程度 | 核心要点 |
|--------|---------|---------|
| 项目搭建 | ✅ | `nest new`、`npm install`、目录结构 |
| 模块（Module） | ✅ | `@Module({ imports, controllers, providers, exports })`，根模块汇总子模块 |
| 控制器（Controller） | ✅ | `@Controller`、`@Get/@Post/@Put/@Delete`、`@Body/@Param/@Query` |
| 服务（Service） | ✅ | `@Injectable()`、`async/await`、业务逻辑抽离 |
| DTO 和数据验证 | ✅ | `class-validator`（`@IsString()`、`@IsInt()`、`@IsOptional()`）、`ValidationPipe` |
| 依赖注入（DI） | ✅ | 构造函数注入 `constructor(private readonly svc: Svc)`，NestJS 自动实例化 |
| RESTful API 设计 | ✅ | GET/POST/PUT/DELETE 语义化路由 |
| 统一响应格式 | ✅ | `ApiResponse.success()` / `ApiResponse.error()` |

### 第二阶段：数据库集成（Prisma + MySQL）

| 知识点 | 掌握程度 | 核心要点 |
|--------|---------|---------|
| Prisma Schema | ✅ | `model` 定义字段、`@id`、`@default`、`@relation` |
| PrismaService | ✅ | 继承 `PrismaClient`，实现 `OnModuleInit/OnModuleDestroy` |
| PrismaModule | ✅ | `@Global()` 全局注册，一次连接所有模块复用 |
| CRUD 操作 | ✅ | `create/findMany/findUnique/update/delete` |
| 分页/排序/条件 | ✅ | `skip/take`、`orderBy`、`where` |
| 种子数据 | ✅ | `prisma/seed.ts` + `npm run prisma:seed` |
| 数据库迁移 | ✅ | `prisma migrate dev`、`prisma db push` |

### 第三阶段：进阶

| 知识点 | 掌握程度 | 核心要点 |
|--------|---------|---------|
| JWT 认证 | ✅ | `@nestjs/jwt`、`sign()` 签发 Token |
| Passport 策略 | ✅ | `passport-jwt` 验证 Token、`passport-local` 验证用户名密码 |
| 守卫（Guards） | ✅ | `CanActivate` 接口、`JwtAuthGuard` 验证登录、`RolesGuard` 检查角色 |
| 管道（Pipes） | ✅ | `PipeTransform` 接口、`ValidationPipe` 验证 DTO、`ParseIntPipe` 参数转换 |
| 拦截器（Interceptors） | ✅ | `NestInterceptor`、`tap()` 记录日志、统一响应包装 |
| 异常过滤器 | ✅ | `ExceptionFilter`、`@Catch()`、统一错误格式 `{ code, message, data }` |
| Swagger / OpenAPI | ✅ | `@nestjs/swagger`、注解生成 API 文档、Authorize JWT 配置 |
| bcrypt 密码加密 | ✅ | `bcrypt.hash()` 注册时加密、`bcrypt.compare()` 登录时比对 |

### 架构流程（已理解）

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
[Prisma]     → 数据库操作 → MySQL
```

---

## 还需继续学习的内容

### 第四阶段：高级特性

| 知识点 | 难度 | 说明 |
|--------|------|------|
| **GraphQL API** | ⭐⭐⭐ | `@nestjs/graphql`、`Resolver`、`@Query/@Mutation`、Code First / Schema First 两种模式。相比 RESTful，GraphQL 让前端自由选择需要的数据字段，避免过度获取。 |
| **WebSocket 实时通信** | ⭐⭐⭐ | `@nestjs/websockets`、`@WebSocketGateway`、Socket.io。适用于聊天、推送、协作编辑等实时场景。 |
| **微服务架构** | ⭐⭐⭐⭐ | `@nestjs/microservices`、TCP/Redis/Kafka 传输层、服务发现、负载均衡。将大应用拆分为独立服务，各自独立部署和扩展。 |
| **任务调度（Cron Jobs）** | ⭐⭐ | `@nestjs/schedule`、`@Cron()` 装饰器。定时同步数据、发送邮件、清理缓存等场景。 |
| **文件上传** | ⭐⭐ | `multer`、本地存储 vs 云存储（OSS/S3）。需要学习 `ParseFilePipe`、文件类型限制、大文件分片上传。 |
| **单元测试 & E2E 测试** | ⭐⭐⭐ | `Jest`、`TestingModule`、`createTestingModule`。为每个 Service、Controller 编写测试用例，覆盖核心业务逻辑。 |
| **Docker 部署** | ⭐⭐ | `Dockerfile`、`docker-compose.yml`、多阶段构建。将 NestJS + MySQL + Redis 等服务容器化，一键部署。 |
| **Redis 缓存** | ⭐⭐ | `@nestjs/cache-manager`、`cache-manager-redis-store`。高频查询接口加缓存，提升性能。 |
| **日志系统** | ⭐⭐ | `@nestjs/config` 环境变量、`winston` / `pino` 日志库、结构化日志记录。生产环境需要分级日志（info/warn/error）和日志聚合。 |
| **API 版本控制** | ⭐ | 前缀路由 `/api/v1/`、`@Version()` 装饰器。API 升级时保证旧版本兼容。 |
| **性能优化** | ⭐⭐ | 数据库索引、连接池、`DataLoader` 解决 N+1 查询问题、CDN 静态资源。 |
| **安全加固** | ⭐⭐ | 限流 `@nestjs/throttler`、CORS 配置、HTTPS、Helmet 安全头、SQL 注入防护。 |

### 学习优先级建议

```
第1优先级（实用性强）:
  1. Redis 缓存        → 提升接口性能，立竿见影
  2. 文件上传          → 几乎每个项目都会用到
  3. 任务调度          → 定时任务场景常见
  4. 日志系统          → 生产环境必备

第2优先级（深度提升）:
  5. 单元测试/E2E 测试  → 保证代码质量
  6. Docker 部署        → 交付和运维
  7. 安全加固           → 防护必学

第3优先级（架构进阶）:
  8. GraphQL            → 适合 BFF 层或开放 API
  9. WebSocket          → 实时需求场景
  10. 微服务             → 大型项目架构
  11. 性能优化           → 高并发场景
```

---

## 快速参考：核心代码模式

### 创建新功能模块的标准流程

```bash
# 1. 使用 CLI 生成模块骨架
nest g resource products

# 2. 定义 Prisma Schema（prisma/schema.prisma）
model Product {
  id    String @id @default(cuid())
  title String
  price Float
}

# 3. 执行迁移
npx prisma migrate dev --name add_product

# 4. 在 Service 中注入 PrismaService 实现 CRUD
@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }
  async findAll() { return this.prisma.product.findMany(); }
  async findOne(id: string) { return this.prisma.product.findUnique({ where: { id } }); }
  async update(id: string, dto: UpdateProductDto) { return this.prisma.product.update({ where: { id }, data: dto }); }
  async remove(id: string) { return this.prisma.product.delete({ where: { id } }); }
}
```

### 认证保护的标准写法

```typescript
// Controller 中使用守卫 + 角色装饰器
@Get(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
async findOne(@Param('id') id: string) {}

// 获取当前登录用户
async getProfile(@Request() req) {
  // req.user 由 JwtStrategy.validate() 注入
  return req.user;
}
```

### 全局异常过滤的标准写法

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        code: exception.getStatus(),
        message: exception.getResponse(),
        data: null,
      });
    } else {
      response.status(500).json({
        code: 500,
        message: '服务器内部错误',
        data: null,
      });
    }
  }
}
```

> 持续更新中。学习愉快！
