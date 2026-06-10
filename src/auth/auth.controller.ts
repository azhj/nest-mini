/**
 * ============================================================
 * 认证控制器（AuthController）
 * ============================================================
 *
 * 职责：处理认证相关请求（登录、获取当前用户信息）
 *
 * 接口设计：
 * POST /auth/login    - 用户登录，签发 JWT
 * GET  /auth/profile  - 获取当前登录用户信息
 */

import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/user.dto';
import { ApiResponse } from '../common/api-response';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

interface AuthenticatedRequest {
  user: { id: number; username: string; role: string };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录
   *
   * 流程：
   * 1. LocalAuthGuard 验证用户名 + 密码（通过 LocalStrategy）
   * 2. 验证通过 → request.user 包含用户信息
   * 3. AuthService.login() 签发 JWT Token
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '用户登录（签发 JWT）' })
  login(@Body() _loginDto: LoginDto, @Request() req: AuthenticatedRequest) {
    const result = this.authService.login(req.user);
    return ApiResponse.success(result, '登录成功');
  }

  /**
   * 获取当前登录用户信息
   *
   * 流程：
   * 1. JwtAuthGuard 验证 JWT Token
   * 2. 验证通过 → request.user 包含用户信息
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取当前登录用户信息' })
  async getProfile(@Request() req: AuthenticatedRequest) {
    const user = await this.authService.getProfile(req.user.id);
    return ApiResponse.success(user, '查询成功');
  }
}
