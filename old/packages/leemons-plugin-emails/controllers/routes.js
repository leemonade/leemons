// TODO Añadir permisos

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
  {
    path: '/providers',
    method: 'GET',
    handler: 'email.providers',
    authenticated: true,
    allowedPermissions: getPermissions('plugins.admin.setup', ['admin']),
  },
  {
    path: '/send-test',
    method: 'POST',
    handler: 'email.sendTest',
  },
  {
    path: '/send-custom-test',
    method: 'POST',
    handler: 'email.sendCustomTest',
  },
  {
    path: '/save-provider',
    method: 'POST',
    handler: 'email.saveProvider',
    authenticated: true,
    allowedPermissions: getPermissions('plugins.admin.setup', ['admin']),
  },
  {
    path: '/remove-provider',
    method: 'POST',
    handler: 'email.removeProvider',
    authenticated: true,
    allowedPermissions: getPermissions('plugins.admin.setup', ['admin']),
  },
  {
    path: '/config',
    method: 'GET',
    handler: 'config.getConfig',
    authenticated: true,
  },
  {
    path: '/config',
    method: 'POST',
    handler: 'config.saveConfig',
    authenticated: true,
  },
];
