import { ForbiddenException } from '@nestjs/common';

export enum PermissionType {
  USER = 'user',
  ADMIN = 'admin',
}

export class AllowPermissionOption {
  permissionType: PermissionType;
}

export function nonThrowableCheckAdminPermission(request: Request, detailPermissions: AllowPermissionOption[]) {
  const req = Object.assign(request);
  const {auth} = req;

  if (!req.auth) {
    return false;
  }

  if (detailPermissions.length === 0) {
    return true;
  }

  let allow = false;
  console.log('auth.permissions:',auth.permissions);
  for (let i = 0; i < auth.permissions.length; i++) {
    const perm = auth.permissions[i];
    if ( perm.type === PermissionType.ADMIN ) {
      allow = true;
      break;
    }else {
      return false;
    }
  }

  return true;
}

export function checkAdminPermission(request: Request, detailPermissions: AllowPermissionOption[]) {
  const req = Object.assign(request);

  if (!req.auth) {
    throw new ForbiddenException('권한이 필요한 요청입니다.');
  }

  if (!this.nonThrowableCheckAdminPermission(request, detailPermissions)) {
    throw new ForbiddenException('권한이 필요한 요청입니다.');
  }

  return true;
}
