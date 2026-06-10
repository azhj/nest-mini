/**
 * ============================================================
 * PC后台管理模块（AdminModule）
 * ============================================================
 *
 * 职责：整合 PC 后台管理所需的所有 Controller
 *
 * 设计思路：
 * - Controller 层独立，不重复业务逻辑
 * - 复用 app/ 下的 Service（UsersService、CatsService、StudentsService）
 * - Controller 通过 @Controller('admin/...') 添加 /admin 前缀
 * - Service 复用，数据层（Prisma）完全共享
 *
 * 接口前缀对照：
 *   手机端（AppModule）     PC后台（AdminModule）
 *   /auth                   /admin/auth
 *   /cats                   /admin/cats
 *   /students               /admin/students
 *   /users                  /admin/users
 */

import { Module } from '@nestjs/common';
import { CatsModule } from '../app/cats/cats.module';
import { StudentsModule } from '../app/students/students.module';
import { UsersModule } from '../app/users/users.module';
import { AdminCatsController } from './admin-cats.controller';
import { AdminStudentsController } from './admin-students.controller';
import { AdminUsersController } from './admin-users.controller';

@Module({
  imports: [
    // 复用手机端的 Service 模块（Service 逻辑完全共享）
    CatsModule,
    StudentsModule,
    UsersModule,
  ],
  controllers: [
    AdminCatsController,
    AdminStudentsController,
    AdminUsersController,
  ],
})
export class AdminModule {}
