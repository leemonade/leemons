const roomService = require('../src/services/room');

async function getMessages(ctx) {
  const messages = await roomService.getMessages(
    ctx.request.params.key,
    ctx.state.userSession.userAgents[0].id
  );
  ctx.status = 200;
  ctx.body = { status: 200, messages };
}

async function getRoom(ctx) {
  const room = await roomService.get(
    ctx.request.params.key,
    ctx.state.userSession.userAgents[0].id
  );
  ctx.status = 200;
  ctx.body = { status: 200, room };
}

async function sendMessage(ctx) {
  await roomService.sendMessage(
    ctx.request.params.key,
    ctx.state.userSession.userAgents[0],
    ctx.request.body.message
  );
  ctx.status = 200;
  ctx.body = { status: 200 };
}

async function markMessagesAsRead(ctx) {
  await roomService.markAsRead(ctx.request.params.key, ctx.state.userSession.userAgents[0].id);
  ctx.status = 200;
  ctx.body = { status: 200 };
}

async function getUnreadMessages(ctx) {
  const count = await roomService.getUnreadMessages(
    ctx.request.body.keys,
    ctx.state.userSession.userAgents[0].id
  );
  ctx.status = 200;
  ctx.body = { status: 200, count };
}

async function getRoomsMessageCount(ctx) {
  const count = await roomService.getRoomsMessageCount(
    ctx.request.body.keys,
    ctx.state.userSession.userAgents[0].id
  );
  ctx.status = 200;
  ctx.body = { status: 200, count };
}

async function getRoomList(ctx) {
  const rooms = await roomService.getUserAgentRoomsList(ctx.state.userSession.userAgents[0].id, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, rooms };
}

async function toggleMutedRoom(ctx) {
  const muted = await roomService.toggleMutedRoom(
    ctx.request.params.key,
    ctx.state.userSession.userAgents[0].id
  );
  ctx.status = 200;
  ctx.body = { status: 200, muted };
}

async function toggleAdminDisableRoom(ctx) {
  const adminDisableMessages = await roomService.toggleDisableRoom(
    ctx.request.params.key,
    ctx.state.userSession.userAgents[0].id
  );
  ctx.status = 200;
  ctx.body = { status: 200, adminDisableMessages };
}

async function toggleAttachedRoom(ctx) {
  const attached = await roomService.toggleAttachedRoom(
    ctx.request.params.key,
    ctx.state.userSession.userAgents[0].id
  );
  ctx.status = 200;
  ctx.body = { status: 200, attached };
}

async function toggleAdminMutedRoom(ctx) {
  const attached = await roomService.toggleAdminMutedRoom(
    ctx.request.params.key,
    ctx.request.body.userAgent,
    ctx.state.userSession.userAgents[0].id
  );
  ctx.status = 200;
  ctx.body = { status: 200, attached };
}

async function adminRemoveUserAgent(ctx) {
  await roomService.adminRemoveUserAgents(
    ctx.request.params.key,
    ctx.request.body.userAgent,
    ctx.state.userSession.userAgents[0].id
  );
  ctx.status = 200;
  ctx.body = { status: 200 };
}

async function adminUpdateRoomName(ctx) {
  const room = await roomService.adminUpdateRoomName(
    ctx.request.params.key,
    ctx.state.userSession.userAgents[0].id,
    ctx.request.body.name
  );
  ctx.status = 200;
  ctx.body = { status: 200, room };
}

async function adminAddUsersToRoom(ctx) {
  const userAgents = await roomService.adminAddUserAgents(
    ctx.request.params.key,
    ctx.request.body.userAgents,
    ctx.state.userSession.userAgents[0].id
  );
  ctx.status = 200;
  ctx.body = { status: 200, userAgents };
}

async function adminRemoveRoom(ctx) {
  await roomService.adminRemoveRoom(ctx.request.params.key, ctx.state.userSession.userAgents[0].id);
  ctx.status = 200;
  ctx.body = { status: 200 };
}

async function createRoom(ctx) {
  let key = null;
  if (ctx.request.body.type === 'group') {
    key = `leemons.comunica.room.group.${global.utils.randomString()}`;
  } else if (ctx.request.body.type === 'chat') {
    key = `leemons.comunica.room.chat.${global.utils.randomString()}`;
  } else {
    throw new Error('Type not allowed');
  }
  const room = await roomService.add(key, {
    ...ctx.request.body,
    adminUserAgents: ctx.request.body.type === 'chat' ? [] : ctx.state.userSession.userAgents[0].id,
  });
  ctx.status = 200;
  ctx.body = { status: 200, room };
}

async function adminChangeRoomImage(ctx) {
  const room = await roomService.adminChangeRoomImage(
    ctx.request.params.key,
    ctx.state.userSession,
    ctx.request.files.image
  );
  ctx.status = 200;
  ctx.body = { status: 200, room };
}

module.exports = {
  toggleAdminDisableRoom,
  toggleAdminMutedRoom,
  getRoomsMessageCount,
  adminRemoveUserAgent,
  adminChangeRoomImage,
  adminUpdateRoomName,
  adminAddUsersToRoom,
  markMessagesAsRead,
  toggleAttachedRoom,
  getUnreadMessages,
  adminRemoveRoom,
  toggleMutedRoom,
  getRoomList,
  sendMessage,
  getMessages,
  createRoom,
  getRoom,
};
