import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {PermissionsEntity, PermissionType } from 'src/database/entities/permissions.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { user } = req;

    if (!user) {
      return false;
    }

    const foundPermissionWithUser = await this.getPermissionForUser(user.id);
    if (!foundPermissionWithUser) {
      throw new ForbiddenException('you have to check authority');
    }

    if (foundPermissionWithUser.type !== PermissionType.ADMIN) {
      throw new ForbiddenException('you have to check authority');
    }

    return foundPermissionWithUser.type === PermissionType.ADMIN;
  }

  async getPermissionForUser(user_id: number) {
    const permissions = await PermissionsEntity.makeQueryBuilder()
     .select(['permissions.id', 'permissions.type'])
      .addSelect(['users.id', 'users.email'])
      .innerJoin('permissions.users', 'users', 'users.id =:user_id', { user_id: user_id })
      .getOne();

    return permissions;
  }
}
