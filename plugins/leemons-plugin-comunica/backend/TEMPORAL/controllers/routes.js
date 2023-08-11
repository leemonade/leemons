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
    path: '/config/general',
    method: 'GET',
    handler: 'config.getGeneralConfig',
    authenticated: true,
  },
  {
    path: '/config/center/:center',
    method: 'GET',
    handler: 'config.getCenterConfig',
    authenticated: true,
  },
  {
    path: '/config/program/:program',
    method: 'GET',
    handler: 'config.getProgramConfig',
    authenticated: true,
  },
  {
    path: '/config',
    method: 'GET',
    handler: 'config.get',
    authenticated: true,
  },
  {
    path: '/config',
    method: 'POST',
    handler: 'config.save',
    authenticated: true,
  },
  {
    path: '/admin/config/:center',
    method: 'GET',
    handler: 'config.getAdminConfig',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.config, ['view']),
  },
  {
    path: '/admin/config/:center',
    method: 'POST',
    handler: 'config.saveAdminConfig',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.config, ['create', 'update']),
  },
  {
    path: '/room/list',
    method: 'GET',
    handler: 'room.getRoomList',
    authenticated: true,
  },
  {
    path: '/room/:key/messages',
    method: 'GET',
    handler: 'room.getMessages',
    authenticated: true,
  },
  {
    path: '/room/:key/messages',
    method: 'POST',
    handler: 'room.sendMessage',
    authenticated: true,
  },
  {
    path: '/room/:key/messages/read',
    method: 'POST',
    handler: 'room.markMessagesAsRead',
    authenticated: true,
  },
  {
    path: '/room/:key',
    method: 'GET',
    handler: 'room.getRoom',
    authenticated: true,
  },
  {
    path: '/room/:key/mute',
    method: 'POST',
    handler: 'room.toggleMutedRoom',
    authenticated: true,
  },
  {
    path: '/room/:key/admin/mute',
    method: 'POST',
    handler: 'room.toggleAdminMutedRoom',
    authenticated: true,
  },
  {
    path: '/room/:key/admin/disable',
    method: 'POST',
    handler: 'room.toggleAdminDisableRoom',
    authenticated: true,
  },
  {
    path: '/room/:key/admin/remove',
    method: 'POST',
    handler: 'room.adminRemoveUserAgent',
    authenticated: true,
  },
  {
    path: '/room/:key/admin/name',
    method: 'POST',
    handler: 'room.adminUpdateRoomName',
    authenticated: true,
  },
  {
    path: '/room/:key/admin/users',
    method: 'POST',
    handler: 'room.adminAddUsersToRoom',
    authenticated: true,
  },
  {
    path: '/room/:key/admin/remove',
    method: 'POST',
    handler: 'room.adminRemoveRoom',
    authenticated: true,
  },
  {
    path: '/room/create',
    method: 'POST',
    handler: 'room.createRoom',
    authenticated: true,
  },
  {
    path: '/room/:key/admin/image',
    method: 'POST',
    handler: 'room.adminChangeRoomImage',
    authenticated: true,
  },
  {
    path: '/room/:key/attach',
    method: 'POST',
    handler: 'room.toggleAttachedRoom',
    authenticated: true,
  },
  {
    path: '/room/messages/unread',
    method: 'POST',
    handler: 'room.getUnreadMessages',
    authenticated: true,
  },
  {
    path: '/room/messages/count',
    method: 'POST',
    handler: 'room.getRoomsMessageCount',
    authenticated: true,
  },
];
