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
      [permissions.feedback]: {
        actions: ['update', 'create', 'delete', 'admin'],
      },
    },
  }),
  // Feedback
  {
    path: '/feedback',
    method: 'POST',
    handler: 'feedback.saveFeedback',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.feedback, ['create', 'update']),
  },
  {
    path: '/feedback/:id',
    method: 'GET',
    handler: 'feedback.getFeedback',
    authenticated: true,
  },
  {
    path: '/feedback/:id',
    method: 'DELETE',
    handler: 'feedback.deleteFeedback',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.feedback, ['delete']),
  },
  {
    path: '/feedback/duplicate',
    method: 'POST',
    handler: 'feedback.duplicateFeedback',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.feedback, ['create', 'update']),
  },
  {
    path: '/feedback/assign',
    method: 'POST',
    handler: 'feedback.assignFeedback',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.feedback, ['create', 'update']),
  },
  {
    path: '/feedback/instance/question/response',
    method: 'POST',
    handler: 'feedback.setQuestionResponse',
    authenticated: true,
  },
];
