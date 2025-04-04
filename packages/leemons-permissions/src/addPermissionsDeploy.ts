import { getItemsHashByKey } from "@leemons/common";
import { getKey, hasKey, setKey } from "@leemons/mongodb-helpers";
import type {
  AddPermissionsDeployParams,
  ObjectPermissions,
  Permission,
  PermissionsHash,
  PermissionsUpdated,
} from "./types";

function getPermissionsHash(permissions?: Permission[]): PermissionsHash {
  if (!permissions || !Array.isArray(permissions) || !permissions.length) {
    return {};
  }

  const permissionsByName = permissions.reduce<ObjectPermissions>(
    (acc, permission) => {
      acc[permission.permissionName] = permission;
      return acc;
    },
    {}
  );

  return getItemsHashByKey({ items: permissionsByName });
}

function getPermissionsUpdated({
  permissions,
  hash,
  savedHash,
}: {
  permissions?: Permission[];
  hash: PermissionsHash;
  savedHash: PermissionsHash;
}): PermissionsUpdated {
  const mixedHash = { ...savedHash, ...hash };

  const newPermissions: Permission[] = [];
  const updatedPermissions: Permission[] = [];
  const deletedPermissions: string[] = [];

  const objectPermissions = (permissions ?? []).reduce<ObjectPermissions>(
    (acc, permission) => {
      acc[permission.permissionName] = permission;
      return acc;
    },
    {}
  );

  Object.keys(mixedHash).forEach((key) => {
    if (!hash[key]) {
      deletedPermissions.push(key);
    } else if (!savedHash[key]) {
      newPermissions.push(objectPermissions[key]);
    } else if (hash[key] !== savedHash[key]) {
      updatedPermissions.push(objectPermissions[key]);
    }
  });

  return { newPermissions, deletedPermissions, updatedPermissions };
}

export async function addPermissionsDeploy({
  keyValueModel,
  permissions,
  ctx,
}: AddPermissionsDeployParams): Promise<void> {
  const permissionsHash = getPermissionsHash(permissions);

  if (!(await hasKey(keyValueModel, "permissions"))) {
    await ctx.tx.call("users.permissions.addMany", permissions);
  } else {
    const currentPermissionsHash = await getKey<PermissionsHash>(
      keyValueModel,
      "permissions"
    );
    const { newPermissions, /* deletedPermissions, */ updatedPermissions } =
      getPermissionsUpdated({
        permissions,
        hash: permissionsHash,
        savedHash: currentPermissionsHash ?? {},
      });

    await ctx.tx.call("users.permissions.addMany", newPermissions);
    // await ctx.tx.call('users.permissions.removeMany', deletedPermissions);
    await ctx.tx.call("users.permissions.updateMany", updatedPermissions);
  }

  await setKey(keyValueModel, "permissions", permissionsHash);
  ctx.tx.emit("init-permissions");
}
