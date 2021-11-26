async function status(ctx) {}

async function testSocketIo(ctx) {
  leemons.socket.emit(ctx.state.userSession.id, 'gatitos', {
    gatitos: [1, 2, 3, 4],
  });
  ctx.status = 200;
  ctx.body = { status: 200 };
}

module.exports = {
  status,
  testSocketIo,
};
