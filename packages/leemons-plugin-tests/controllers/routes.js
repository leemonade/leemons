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
  // Tags
  ...leemons.getPlugin('common').services.tags.getRoutes('tags', {
    authenticated: true,
    allowedPermissions: {
      [permissions.questionBanks]: {
        actions: ['update', 'create', 'delete', 'admin'],
      },
    },
  }),
  // Questions banks
  {
    path: '/question-bank/list',
    method: 'POST',
    handler: 'questionsBanks.listQuestionBanks',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.questionBanks, ['view']),
  },
  {
    path: '/question-bank/:id',
    method: 'GET',
    handler: 'questionsBanks.getQuestionBankDetail',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.questionBanks, ['view']),
  },
  {
    path: '/question-bank',
    method: 'POST',
    handler: 'questionsBanks.saveQuestionBanks',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.questionBanks, ['create', 'update']),
  },
  // Tests
  {
    path: '/tests',
    method: 'GET',
    handler: 'tests.listTests',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.tests, ['view']),
  },
  {
    path: '/tests/:id',
    method: 'GET',
    handler: 'tests.getTest',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.tests, ['view']),
  },
  {
    path: '/tests',
    method: 'POST',
    handler: 'tests.saveTest',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.tests, ['create', 'update']),
  },
];
