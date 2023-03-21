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
    path: '/assistance/roll-call',
    method: 'POST',
    handler: 'assistance.rollCall',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.attendance, ['create']),
  },
  {
    path: '/session/temporal/:class',
    method: 'GET',
    handler: 'session.getTemporalSessions',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.attendance, ['view', 'create', 'update']),
  },
];
