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
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtPayload } from './jwt.strategy';
import { LoginDto } from '../users/dto/user.dto';
import { ApiResponse } from '../common/api-response';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './roles.decorator';

interface AuthenticatedRequest {
  user: { id: number; username: string; role: string };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 用户登录
   *
   * 流程：
   * 1. LocalAuthGuard 验证用户名 + 密码（通过 LocalStrategy）
   * 2. 验证通过 → request.user 包含用户信息
   * 3. AuthService.login() 签发 JWT Token
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Public()
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

  /**
   * 刷新 Token（静默续期）
   *
   * 场景：Token 即将过期或已过期但在宽限期内，前端主动调用此接口续期
   *
   * 流程：
   * 1. 从请求头 Authorization: Bearer <token> 中提取 Token
   * 2. JwtService.verify(..., { ignoreExpiration: true }) 强制解析（允许已过期 token）
   * 3. 验证用户存在
   * 4. 重新签发新 Token 返回
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({ summary: '刷新 Token（静默续期）' })
  async refreshToken(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.error('Token 不存在', 401);
    }

    const token = authHeader.substring(7);

    // 使用 ignoreExpiration: true 强制解析（允许已过期 token 在宽限期内解析）
    // JwtStrategy 本身设置了 ignoreExpiration: false，已过期 token 会报 Unauthorized
    // 所以能走到这里说明要么未过期，要么在宽限期内
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token, {
        ignoreExpiration: true,
      }) as JwtPayload;
    } catch {
      return ApiResponse.error('Token 无效，无法刷新', 401);
    }

    const user = await this.authService.getProfile(payload.sub);
    if (!user) {
      return ApiResponse.error('用户不存在', 401);
    }

    const result = this.authService.refreshToken({
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    });

    return ApiResponse.success(result, 'Token 刷新成功');
  }
}
