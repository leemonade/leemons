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
    ctx.state.userSession.userAgents[0].id,
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

module.exports = {
  toggleAdminMutedRoom,
  getRoomsMessageCount,
  adminRemoveUserAgent,
  adminUpdateRoomName,
  adminAddUsersToRoom,
  markMessagesAsRead,
  toggleAttachedRoom,
  getUnreadMessages,
  toggleMutedRoom,
  getRoomList,
  sendMessage,
  getMessages,
  getRoom,
};
