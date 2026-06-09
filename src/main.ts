/**
 * ============================================================
 * 主入口文件（main.ts）
 * ============================================================
 *
 * 职责：创建并启动 NestJS 应用实例
 *
 * 启动流程：
 *   bootstrap() → NestFactory.create(AppModule) → app.listen() → 监听 3000 端口
 */

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // 创建 Nest 应用实例
  // NestFactory.create() 读取 AppModule，扫描所有 @Module 装饰的类
  const app = await NestFactory.create(AppModule);

  /**
   * 全局管道：ValidationPipe
   *
   * 什么是管道（Pipe）？
   * 管道是 @Injectable() 的类，负责"转换"输入数据或"验证"输入数据。
   * 管道有两个类型：
   *   - 转换管道：将原始输入转换为期望格式（如字符串转数字）
   *   - 验证管道：验证输入是否符合规则，不符合则抛异常
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
      whitelist: true, // 自动剥离 DTO 中未声明的字段（安全防护）
      forbidNonWhitelisted: true, // 发现多余字段直接报错
      transform: true, // 自动类型转换（如 ?age=3 字符串 → 数字 3）
    }),
  );

  /**
   * 启用 CORS
   * 允许前端应用（如 Vue、React）跨域访问 API
   * 生产环境建议配置具体的域名白名单，而不是 true
   */
  app.enableCors();

  /**
   * Swagger API 文档
   * 启动后访问 http://localhost:3008/api 查看接口文档
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Mini API')
    .setDescription('学生管理系统 API 文档')
    .setVersion('1.0')
    .addTag('cats', '猫咪接口')
    .addTag('students', '学生接口')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  const port = process.env.PORT ?? 3011;

  // 启动服务器
  await app.listen(port);

  // 启动成功后打印提示
  console.log(`✅ NestJS 应用已启动！`);
  console.log(`📍 访问地址：http://localhost:${port}`);
  console.log(`📖 Swagger 文档：http://localhost:${port}/api`);
  console.log(`🐱 猫咪 API：http://localhost:${port}/cats`);
}

bootstrap();
