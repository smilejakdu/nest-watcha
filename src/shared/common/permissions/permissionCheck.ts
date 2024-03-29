import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {PermissionEntity, PermissionType} from '../../../database/entities/User/Permission.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const {user} = req;

    if (!user) {
      return false;
    }

    const foundPermissionWithUser = await this.getPermissionForUser(user.id);
    if(!foundPermissionWithUser){
      throw new ForbiddenException('권한이 필요한 요청입니다.01');
    }

    if (foundPermissionWithUser.type !== PermissionType.ADMIN) {
      throw new ForbiddenException('권한이 필요한 요청입니다.02');
    }

    return foundPermissionWithUser.type === PermissionType.ADMIN;
  }

  async getPermissionForUser(userId) {
    return await PermissionEntity.makeQueryBuilder()
        .select([
          'permissions.id',
          'permissions.type'
        ])
        .addSelect([
          'users.id',
          'users.username',
          'users.email',
          'users.phone'
        ])
        .innerJoin('permissions.users', 'users', 'users.id =:userId', {userId: userId})
        .getOne();
  }
}