/**
 * ============================================================
 * 猫咪控制器（Controller）- 路由处理层
 * ============================================================
 *
 * 什么是 Controller？
 * Controller 负责接收 HTTP 请求、解析参数、调用 Service 处理业务逻辑，
 * 最后返回 HTTP 响应。它是"路由"和"业务逻辑"之间的调度器。
 *
 * 请求生命周期：
 *   HTTP 请求 → 中间件 → 守卫(Guard) → 管道(Pipe) → Controller → Service → 数据库
 *   数据库 → Service → Controller → 拦截器(Interceptor) → HTTP 响应
 *
 * RESTful 路由设计规范：
 *   GET    /cats        → findAll()       获取所有
 *   GET    /cats/:id    → findOne()       获取单个
 *   POST   /cats        → create()        创建
 *   PUT    /cats/:id    → update()        完整更新（替换）
 *   PATCH  /cats/:id    → update()        部分更新（推荐）
 *   DELETE /cats/:id    → remove()        删除
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import type { Cat } from './entities/cat.entity';

@Controller('cats') // 👈 所有路由以 /cats 开头
export class CatsController {
  /**
   * 依赖注入：NestJS 会自动实例化 CatsService 并注入到这里
   * private readonly 可以防止内部被意外修改（只读引用）
   */
  constructor(private readonly catsService: CatsService) {}

  /**
   * GET /cats
   * 获取所有猫咪列表
   */
  @Get()
  findAll(): Cat[] {
    return this.catsService.findAll();
  }

  /**
   * GET /cats/:id
   * 根据 ID 获取单个猫咪
   *
   * @Param('id') 的作用：
   * NestJS 会自动从 URL 中提取 :id 部分，注入到 id 参数中
   * 例如：GET /cats/123 → id = '123'
   */
  @Get(':id')
  findOne(@Param('id') id: string): Cat {
    return this.catsService.findOne(id);
  }

  /**
   * POST /cats
   * 创建一只新猫咪
   *
   * @Body() 的作用：
   * 自动解析请求体（JSON），并将数据映射到 CreateCatDto 对象
   * DTO 中的验证装饰器会自动校验数据格式，不合法则返回 400 错误
   *
   * @HttpCode(HttpStatus.CREATED) 的作用：
   * 默认 POST 返回 200，这里改为返回 201 Created，更符合 RESTful 规范
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCatDto: CreateCatDto): Cat {
    return this.catsService.create(createCatDto);
  }

  /**
   * PUT /cats/:id
   * 完整更新一只猫咪（替换式更新，所有字段都要传）
   *
   * 注意：实际项目中更推荐 PATCH（部分更新），但这里用 PUT 做演示
   * PUT 和 PATCH 的区别：
   * - PUT：客户端传完整对象，缺失字段用 null 或默认值
   * - PATCH：客户端只传输要修改的字段
   */
  @Put(':id')
  update(
    @Param('id') id: string, // URL 参数：猫咪 ID
    @Body() updateCatDto: UpdateCatDto, // 请求体：要更新的字段
  ): Cat {
    return this.catsService.update(id, updateCatDto);
  }

  /**
   * DELETE /cats/:id
   * 删除一只猫咪
   *
   * @HttpCode(HttpStatus.NO_CONTENT)：
   * 通常 DELETE 成功返回 204 No Content（无响应体）
   * 如果写了 @HttpCode(204)，返回值会被忽略
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    this.catsService.remove(id);
  }
}
