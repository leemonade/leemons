import type { AnyContext } from '@leemons/moleculer';
import type { Model } from '@leemons/mongodb';
import type { GetKeyValueModel } from '@leemons/mongodb-helpers';

export interface Permission {
  permissionName: string;
  actionNames: string[];
}

export interface AddPermissionsDeployParams {
  keyValueModel: Model<GetKeyValueModel>;
  permissions: Permission[];
  ctx: AnyContext;
}

export interface PermissionsUpdated {
  newPermissions: Permission[];
  deletedPermissions: string[];
  updatedPermissions: Permission[];
}

export interface PermissionsHash {
  [key: string]: string;
}

export interface ObjectPermissions {
  [key: string]: Permission;
}
