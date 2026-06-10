/**
 * ============================================================
 * 角色装饰器（Roles Decorator）
 * ============================================================
 *
 * 职责：为路由标记所需角色，配合 RolesGuard 实现权限控制
 *
 * 装饰器原理：
 * NestJS 使用"装饰器反射"机制存储元数据
 * RolesGuard 通过 Reflector 读取这些元数据
 *
 * 使用示例：
 * @Controller('cats')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * export class CatsController {
 *   @Get()
 *   @Roles('admin')
 *   findAll() {}
 *
 *   @Post()
 *   @Roles('admin', 'user')  // 支持多个角色（任意一个即可）
 *   create() {}
 * }
 */

import { SetMetadata } from '@nestjs/common';

/**
 * 角色元数据的 Key
 * NestJS 用字符串作为 key 存储/读取元数据
 */
export const ROLES_KEY = 'roles';

/**
 * 公开接口元数据的 Key
 * 标记了 @Public() 的路由将跳过 JWT 验证
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * @Public() 装饰器工厂
 *
 * 用于标记不需要登录验证的路由（如登录接口）
 * 全局 JWT 守卫会检查此元数据，跳过验证
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * @Roles() 装饰器工厂
 *
 * @param roles 允许访问的角色数组，如 ['admin'] 或 ['admin', 'user']
 *
 * 内部原理：
 * @Roles('admin') 会被编译为 SetMetadata('roles', ['admin'])
 * 实际效果：将 ['admin'] 存储到路由的元数据中，key 为 'roles'
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
