/**
 * ============================================================
 * 健康检查服务（HealthService）
 * ============================================================
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/** 健康状态枚举 */
export enum HealthStatus {
  UP = 'UP',
  DOWN = 'DOWN',
}

/** 健康检查结果 */
export interface HealthCheckResult {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  database?: {
    status: HealthStatus;
    latency?: number;
    error?: string;
  };
}

/** 服务信息 */
export interface ServiceInfo {
  name: string;
  version: string;
  nodeVersion: string;
  environment: string;
  uptime: number;
  timestamp: string;
}

@Injectable()
export class HealthService {
  /** 进程启动时间（秒） */
  private readonly startTime = Date.now();

  constructor(private readonly prisma: PrismaService) {}

  /**
   * 存活探针（Liveness Probe）
   * - K8s 用这个判断进程是否存活
   * - 只检查进程是否在运行，不检查依赖
   */
  isAlive(): { status: HealthStatus; timestamp: string } {
    return {
      status: HealthStatus.UP,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 就绪探针（Readiness Probe）
   * - K8s 用这个判断是否可以接收流量
   * - 检查数据库连接是否正常
   */
  async isReady(): Promise<HealthCheckResult> {
    const dbResult = await this.checkDatabase();
    const overall =
      dbResult.status === HealthStatus.UP ? HealthStatus.UP : HealthStatus.DOWN;

    return {
      status: overall,
      timestamp: new Date().toISOString(),
      uptime: this.getUptime(),
      database: dbResult,
    };
  }

  /**
   * 服务详细信息
   */
  getInfo(): ServiceInfo {
    return {
      name: 'nest-mini',
      version: '1.0.0',
      nodeVersion: process.version,
      environment: process.env.NODE_ENV ?? 'development',
      uptime: this.getUptime(),
      timestamp: new Date().toISOString(),
    };
  }

  /** 获取进程运行时长（秒） */
  private getUptime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * 数据库健康检查
   * - 执行一条简单查询验证连接
   */
  private async checkDatabase(): Promise<{
    status: HealthStatus;
    latency?: number;
    error?: string;
  }> {
    const start = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: HealthStatus.UP,
        latency: Date.now() - start,
      };
    } catch (err) {
      const error = err as Error;
      return {
        status: HealthStatus.DOWN,
        error: error.message ?? '数据库连接失败',
      };
    }
  }
}
