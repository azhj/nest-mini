/**
 * ============================================================
 * 用户控制器（UsersController）- 路由处理层
 * ============================================================
 *
 * 职责：处理用户相关 HTTP 请求
 *
 * 接口设计（统一使用 POST 方法）：
 * POST /users/list         - 获取所有用户列表（需管理员权限）
 * POST /users/detail/:id   - 获取单个用户信息（需管理员权限）
 * POST /users              - 创建用户（注册）
 * POST /users/update/:id   - 更新用户（需管理员权限）
 * POST /users/delete/:id   - 删除用户（需管理员权限）
 */

import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ApiResponse } from '../common/api-response';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '创建用户（注册）' })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return ApiResponse.success(user, '注册成功');
  }

  @Post('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取所有用户（管理员）' })
  async findAll() {
    const users = await this.usersService.findAll();
    return ApiResponse.success(users, '查询成功');
  }

  @Post('detail/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取单个用户（管理员）' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return ApiResponse.success(user, '查询成功');
  }

  @Post('update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新用户（管理员）' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, dto);
    return ApiResponse.success(user, '更新成功');
  }

  @Post('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除用户（管理员）' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return ApiResponse.success(null, '删除成功');
  }
}
