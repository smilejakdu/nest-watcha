import { SetMetadata } from '@nestjs/common';
import { PermissionType } from '../../../database/entities/User/permission.entity';


export const PERMISSION_KEY = 'permission';
export const Permissions = (permission: PermissionType) => SetMetadata(PERMISSION_KEY, {permission});
