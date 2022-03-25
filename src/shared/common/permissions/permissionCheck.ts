import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionEntity, PermissionType } from '../../../database/entities/permission.entity';
import { PERMISSION_KEY } from './permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<PermissionEntity>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);
    const req = context.switchToHttp().getRequest();
    const {user} = req;

    if (!user) {
      return false;
    }

    if (!requiredPermission) {
      return false;
    }

    const foundPermissionWithUser = await this.getPermissionForUser(user.id);
    return foundPermissionWithUser.type === PermissionType.ADMIN;
  }

  async getPermissionForUser(userId) {
    const permissions = await PermissionEntity.makeQueryBuilder()
      .select([
        'permission.id',
        'permission.type'
      ])
      .addSelect([
        'users.id',
        'users.username',
        'users.email',
        'users.phone'
      ])
      .innerJoin('permission.users','users','users.id =:userId',{userId:userId})
      .getOne();

    return permissions;
  }
}

export function nonThrowableCheckAdminPermission(request: Request, detailPermissions: string) {
  console.log('request:',request);
  const req = Object.assign(request);
  const userId = req.userId;

  if (!req.detailPermissions) {
    return false;
  }

  if (detailPermissions.length === 0) {
    return true;
  }

  return detailPermissions === PermissionType.ADMIN;
}

export function checkAdminPermission(request: Request, detailPermissions: PermissionType) {
  const req = Object.assign(request);

  if (!req.auth) {
    throw new ForbiddenException('권한이 필요한 요청입니다.');
  }

  if (!this.nonThrowableCheckAdminPermission(request, detailPermissions)) {
    throw new ForbiddenException('권한이 필요한 요청입니다.');
  }

  return true;
}

