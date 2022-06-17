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
  {
    path: '/i18n/:page/:lang',
    method: 'GET',
    handler: 'i18n.getLang',
  },
  {
    path: '/settings',
    method: 'GET',
    handler: 'settings.findOne',
  },
  {
    path: '/settings/languages',
    method: 'POST',
    handler: 'settings.setLanguages',
  },
  {
    path: '/settings/signup',
    method: 'POST',
    handler: 'settings.signup',
  },
  {
    path: '/settings',
    method: 'POST',
    handler: 'settings.update',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.config, ['admin']),
  },
];
