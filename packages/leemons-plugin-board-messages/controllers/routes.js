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
    path: '/overlaps',
    method: 'POST',
    handler: 'messages.getOverlaps',
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
  {
    path: '/click',
    method: 'POST',
    handler: 'messages.addClick',
    authenticated: true,
  },
  {
    path: '/view',
    method: 'POST',
    handler: 'messages.addView',
    authenticated: true,
  },
];
