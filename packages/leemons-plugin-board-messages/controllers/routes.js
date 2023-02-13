module.exports = [
  {
    path: '/list',
    method: 'POST',
    handler: 'messages.list',
    authenticated: true,
    allowedPermissions: {
      'plugins.board-messages.board-messages': {
        actions: ['view', 'update', 'create', 'delete', 'admin'],
      },
    },
  },
  {
    path: '/save',
    method: 'POST',
    handler: 'messages.save',
    authenticated: true,
    allowedPermissions: {
      'plugins.board-messages.board-messages': {
        actions: ['update', 'create', 'admin'],
      },
    },
  },
  {
    path: '/active',
    method: 'POST',
    handler: 'messages.getActive',
    authenticated: true,
  },
];
