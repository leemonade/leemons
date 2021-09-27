function getPermissionsFromObj(permissionObj) {
  if (Array.isArray(permissionObj)) {
    return permissionObj.map((permission) => getPermissionsFromObj(permission)).flat();
  }
  if (permissionObj.permission) {
    return [permissionObj.permission];
  }
  if (permissionObj.permissions) {
    return permissionObj.permissions;
  }
  return [];
}

function getPermissions(permissions) {
  return permissions.map(([, permission]) => getPermissionsFromObj(permission)).flat();
}

function checkPermissionsSatisfaction(permissionObj, userPermissions, isSuperAdmin) {
  if (isSuperAdmin) {
    return true;
  }
  if (Array.isArray(permissionObj)) {
    const allResults = permissionObj
      .map((obj) => checkPermissionsSatisfaction(obj, userPermissions, isSuperAdmin))
      .every((result) => result);
    return allResults;
  }

  let neededPermissions;
  let expectedLength;
  if (permissionObj.permission) {
    expectedLength = 1;
    neededPermissions = userPermissions.filter(
      ({ permissionName }) => permissionName === permissionObj.permission
    );
  }
  if (permissionObj.permissions) {
    expectedLength = permissionObj.permissions.length;
    neededPermissions = userPermissions.filter(({ permissionName }) =>
      permissionObj.permissions.includes(permissionName)
    );
  }

  if (neededPermissions.length !== expectedLength) {
    return false;
  }

  return neededPermissions
    .map(
      ({ actionNames }) => !!permissionObj.actions.find((action) => actionNames.includes(action))
    )
    .every((value) => value);
}

module.exports = async function getSessionPermissions({
  this: context,
  userSession,
  permissions: permissionsObjs,
  transacting,
} = {}) {
  const permissionsEntries = Object.entries(permissionsObjs);
  const permissions = getPermissions(permissionsEntries);
  let userPermissions = [];
  if (userSession) {
    userPermissions = await leemons
      .getPlugin('users')
      .services.permissions.getUserAgentPermissions(userSession.userAgents, {
        transacting,
        query: {
          permissionName_$in: permissions,
        },
      });
  }

  return permissionsEntries.reduce(
    (obj, [name, permissionObj]) => ({
      ...obj,
      // TODO: Check if it is super admin
      [name]: checkPermissionsSatisfaction(
        permissionObj,
        userPermissions,
        !userSession && context.calledFrom === 'plugins.classroom'
      ),
    }),
    {}
  );
};
