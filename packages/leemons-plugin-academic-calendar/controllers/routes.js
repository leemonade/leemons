// TODO [Importante]: Añadir autenticación y permisos
const {
  permissions: { names: permissions },
} = require('../config/constants');

const getPermissions = (permissionsArr, actions = null) => {
  if (Array.isArray(permissionsArr)) {
    return permissionsArr.reduce(
      (obj, [permission, _actions]) => ({
        ...obj,
        [permission]: {
          actions: _actions.includes('admin') ? _actions : ['admin', ..._actions],
        },
      }),
      {}
    );
  }
  return {
    [permissionsArr]: {
      actions: actions.includes('admin') ? actions : ['admin', ...actions],
    },
  };
};

module.exports = [
  // Config
  {
    path: '/config/:programId',
    method: 'GET',
    handler: 'config.get',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.config, ['view']),
  },
  {
    path: '/config',
    method: 'POST',
    handler: 'config.save',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.config, ['create', 'update']),
  },
];
