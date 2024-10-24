const { getItemsHashByKey } = require('@leemons/common');
const { hasKey, setKey, getKey } = require('@leemons/mongodb-helpers');

function getPermissionsHash(permissions) {
  if (!permissions || !Array.isArray(permissions) || !permissions.length) {
    return {};
  }

  const permissionsByName = permissions.reduce((acc, permission) => {
    acc[permission.permissionName] = permission;
    return acc;
  }, {});

  return getItemsHashByKey({ items: permissionsByName });
}

function getPermissionsUpdated({ permissions, hash, savedHash }) {
  const mixedHash = { ...savedHash, ...hash };

  const newPermissions = [];
  const updatedPermissions = [];
  const deletedPermissions = [];

  const objectPermissions = (permissions ?? []).reduce((acc, permission) => {
    acc[permission.permissionName] = permission;
    return acc;
  }, {});

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

async function addPermissionsDeploy({ keyValueModel, permissions, ctx }) {
  const permissionsHash = getPermissionsHash(permissions);

  if (!(await hasKey(keyValueModel, `permissions`))) {
    await ctx.tx.call('users.permissions.addMany', permissions);
  } else {
    const currentPermissionsHash = await getKey(keyValueModel, `permissions`);
    const { newPermissions, /* deletedPermissions, */ updatedPermissions } = getPermissionsUpdated({
      permissions,
      hash: permissionsHash,
      savedHash: currentPermissionsHash ?? {},
    });

    await ctx.tx.call('users.permissions.addMany', newPermissions);
    // await ctx.tx.call('users.permissions.removeMany', deletedPermissions);
    await ctx.tx.call('users.permissions.updateMany', updatedPermissions);
  }

  await setKey(keyValueModel, `permissions`, permissionsHash);
  ctx.tx.emit('init-permissions');
}

module.exports = { addPermissionsDeploy };
