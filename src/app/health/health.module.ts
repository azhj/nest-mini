/**
 * ============================================================
 * 健康检查模块（HealthModule）
 * ============================================================
 *
 * 职责：提供系统健康检查接口，用于：
 * - K8s/负载均衡探测存活状态（/health/live）
 * - 监控数据库连接状态（/health/ready）
 * - 服务基本信息（/health/info）
 */

import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
