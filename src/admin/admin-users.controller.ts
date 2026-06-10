/**
 * ============================================================
 * PC后台用户控制器（AdminUsersController）
 * ============================================================
 *
 * PC后台接口：所有路由自动加 /admin 前缀
 *
 * 接口设计：
 * POST /admin/users              - 创建用户
 * POST /admin/users/list         - 获取所有用户列表
 * POST /admin/users/detail/:id   - 获取单个用户详情
 * POST /admin/users/update/:id   - 更新用户
 * POST /admin/users/delete/:id   - 删除用户
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
import { UsersService } from '../app/users/users.service';
import { CreateUserDto, UpdateUserDto } from '../app/users/dto/user.dto';
import { ApiResponse } from '../app/common/api-response';
import { JwtAuthGuard } from '../app/auth/jwt-auth.guard';
import { RolesGuard } from '../app/auth/roles.guard';
import { Roles } from '../app/auth/roles.decorator';

@ApiTags('admin-users')
@Controller('admin/users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '创建用户（PC后台）' })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return ApiResponse.success(user, '创建成功');
  }

  @Post('list')
  @ApiOperation({ summary: '获取所有用户列表（PC后台）' })
  async findAll() {
    const users = await this.usersService.findAll();
    return ApiResponse.success(users, '查询成功');
  }

  @Post('detail/:id')
  @ApiOperation({ summary: '获取单个用户详情（PC后台）' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return ApiResponse.success(user, '查询成功');
  }

  @Post('update/:id')
  @ApiOperation({ summary: '更新用户（PC后台）' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, dto);
    return ApiResponse.success(user, '更新成功');
  }

  @Post('delete/:id')
  @ApiOperation({ summary: '删除用户（PC后台）' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return ApiResponse.success(null, '删除成功');
  }
}
