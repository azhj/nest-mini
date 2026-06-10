/**
 * ============================================================
 * 健康检查控制器（HealthController）- 路由处理层
 * ============================================================
 *
 * 接口设计：
 * GET /health/live   - 存活探针（K8s liveness）
 * GET /health/ready  - 就绪探针（K8s readiness，含数据库检测）
 * GET /health/info   - 服务详细信息
 */

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProduces } from '@nestjs/swagger';
import {
  HealthService,
  HealthCheckResult,
  ServiceInfo,
  HealthStatus,
} from './health.service';
import { ApiResponse } from '../common/api-response';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * 存活探针（Liveness Probe）
   * - 快速返回进程是否存活
   * - 用于 K8s 判断进程是否需要重启
   */
  @Get('live')
  @ApiOperation({ summary: '存活探针（Liveness Probe）' })
  @ApiProduces('application/json')
  isAlive() {
    return ApiResponse.success(this.healthService.isAlive(), '存活');
  }

  /**
   * 就绪探针（Readiness Probe）
   * - 检查数据库连接是否正常
   * - 用于 K8s 判断是否可以接收流量
   */
  @Get('ready')
  @ApiOperation({ summary: '就绪探针（Readiness Probe）' })
  @ApiProduces('application/json')
  async isReady(): Promise<ApiResponse<HealthCheckResult>> {
    const result = await this.healthService.isReady();
    const message = result.status === HealthStatus.UP ? '就绪' : '未就绪';
    return ApiResponse.success(result, message);
  }

  /**
   * 服务详细信息
   */
  @Get('info')
  @ApiOperation({ summary: '服务详细信息' })
  @ApiProduces('application/json')
  getInfo(): ApiResponse<ServiceInfo> {
    return ApiResponse.success(this.healthService.getInfo(), '查询成功');
  }
}
