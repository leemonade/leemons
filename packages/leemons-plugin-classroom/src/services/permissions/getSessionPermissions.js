function getActionsFromObj(permissionObj) {
  if (Array.isArray(permissionObj)) {
    return [...new Set(permissionObj.map((permission) => getActionsFromObj(permission)).flat())];
  }

  return permissionObj.actions;
}

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

function checkPermissionsSatisfaction(permissionObj, userPermissions) {
  if (Array.isArray(permissionObj)) {
    const allResults = permissionObj.map((permission) =>
      checkPermissionsSatisfaction(permission, userPermissions)
    );

    return getActionsFromObj(permissionObj).reduce(
      (obj, action) => ({ ...obj, [action]: allResults.some((result) => result[action] === true) }),
      {}
    );
  }

  let neededPermissions;
  let actionsNeeded;
  if (permissionObj.permission) {
    actionsNeeded = 1;
    neededPermissions = userPermissions.filter(
      ({ permissionName }) => permissionName === permissionObj.permission
    );
  }
  if (permissionObj.permissions) {
    actionsNeeded = permissionObj.permissions.length;
    neededPermissions = userPermissions.filter(({ permissionName }) =>
      permissionObj.permissions.includes(permissionName)
    );
  }
  return permissionObj.actions.reduce(
    (obj, action) => ({
      ...obj,
      [action]:
        neededPermissions.filter(({ actionNames }) => actionNames?.includes(action)).length ===
        actionsNeeded,
    }),
    {}
  );
}

module.exports = async function getSessionPermissions({
  userSession,
  permissions: permissionsObjs,
  transacting,
} = {}) {
  const permissionsEntries = Object.entries(permissionsObjs);
  const permissions = getPermissions(permissionsEntries);
  const userPermissions = await leemons
    .getPlugin('users')
    .services.permissions.getUserAgentPermissions(userSession.userAgents, {
      transacting,
      query: {
        permissionName_$in: permissions,
      },
    });

  return permissionsEntries.reduce(
    (obj, [name, permissionObj]) => ({
      ...obj,
      [name]: checkPermissionsSatisfaction(permissionObj, userPermissions),
    }),
    {}
  );
};
