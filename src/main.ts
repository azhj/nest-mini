/**
 * ============================================================
 * 主入口文件（main.ts）
 * ============================================================
 *
 * 职责：创建并启动 NestJS 应用实例
 *
 * 启动流程：
 *   bootstrap() → NestFactory.create(AppModule)
 *     → 全局管道/拦截器/异常过滤器 → app.listen() → 监听端口
 */

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './app/common/all-exceptions.filter';
import { HttpInterceptor } from './app/common/http.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 启用静态文件服务，访问 http://localhost:port/uploads/filename 可查看上传的文件
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  /**
   * 注意：暂不使用 setGlobalPrefix，保持手机端和PC端接口路径清晰分离
   *
   * - 手机端接口（AppModule）：/auth, /cats, /students, /users, /health
   * - PC后台接口（AdminModule）：/admin/auth, /admin/cats, /admin/students
   *
   * AdminModule 内的 Controller 通过 @Controller('admin/...') 自行添加前缀
   */

  /**
   * 全局管道：ValidationPipe
   *
   * ValidationPipe 的作用：
   * 1. 自动启用 DTO 中的 class-validator 装饰器验证
   * 2. 自动启用 class-transformer 进行类型转换
   * 3. whitelist: true → 自动剥离 DTO 中没有声明的字段（防止攻击）
   * 4. forbidNonWhitelisted: true → 发现多余字段时报错
   * 5. transform: true → 自动将 Query/Param 的字符串转为实际类型
   *
   * 这里配置一次，全局生效，所有接口自动获得验证能力！
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * 全局异常过滤器：AllExceptionsFilter
   *
   * AllExceptionsFilter 的作用：
   * 1. 捕获所有未被处理的异常（HttpException + 未知异常）
   * 2. 统一返回格式 { code, message, data, timestamp }
   * 3. 记录错误日志，便于排查
   *
   * 注意：
   * - 异常过滤器先于拦截器执行（异常被捕获后不会触发拦截器的 next())
   * - ValidationPipe 抛出的验证错误也会被捕获并统一格式
   */
  app.useGlobalFilters(new AllExceptionsFilter());

  /**
   * 全局响应拦截器：HttpInterceptor
   *
   * HttpInterceptor 的作用：
   * 1. 记录每个请求的开始和结束
   * 2. 打印请求方法、路径、耗时
   * 3. 统一响应格式（Date 序列化）
   */
  app.useGlobalInterceptors(new HttpInterceptor());

  /**
   * 启用 CORS
   *
   * 允许前端应用（如 Vue、React）跨域访问 API
   * 生产环境建议配置具体的域名白名单，而不是 true
   */
  app.enableCors();

  /**
   * Swagger API 文档
   * 启动后访问 http://localhost:3011/api 查看接口文档
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Mini API')
    .setDescription('学生管理系统 API 文档')
    .setVersion('1.0')
    .addTag('health', '健康检查接口')
    .addTag('auth', '认证接口（手机端）')
    .addTag('users', '用户接口（手机端）')
    .addTag('cats', '猫咪接口（手机端）')
    .addTag('students', '学生接口（手机端）')
    .addTag('upload', '文件上传接口')
    .addTag('admin-cats', '猫咪接口（PC后台）')
    .addTag('admin-students', '学生接口（PC后台）')
    .addBearerAuth()
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  const port = process.env.PORT ?? 3011;

  await app.listen(port);
  console.log(`✅ NestJS 应用已启动！`);
  console.log(`📍 访问地址：http://localhost:${port}`);
  console.log(`📖 Swagger 文档：http://localhost:${port}/api`);
  console.log(`💚 健康检查：http://localhost:${port}/health/info`);
  console.log(`🔐 手机端认证 API：http://localhost:${port}/auth`);
  console.log(`🖥️ PC后台猫咪 API：http://localhost:${port}/admin/cats`);
  console.log(`🖥️ PC后台学生 API：http://localhost:${port}/admin/students`);
}

void bootstrap();
