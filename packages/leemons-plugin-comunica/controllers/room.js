const roomService = require('../src/services/room');


async function getMessages(ctx) {
  const messages = await roomService.getMessages(ctx.request.params.id, {userSession: ctx.state.userSession});
  ctx.status = 200;
  ctx.body = {status: 200, messages};
}

module.exports = {
  getMessages
};
