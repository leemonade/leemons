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

module.exports = {
  markMessagesAsRead,
  getUnreadMessages,
  sendMessage,
  getMessages,
  getRoom,
};
