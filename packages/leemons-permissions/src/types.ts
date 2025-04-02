import type { Context } from '@leemons/moleculer';
import type { Model } from '@leemons/mongodb';
import type { GetKeyValueModel } from '@leemons/mongodb-helpers';

export interface Permission {
  permissionName: string;
  actions: string[];
  localizationName?: Record<string, string>;
}

export interface AddPermissionsDeployParams {
  keyValueModel: Model<GetKeyValueModel>;
  permissions: Permission[];
  ctx: Context;
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
