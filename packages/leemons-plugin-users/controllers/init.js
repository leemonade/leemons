const { fetchJson } = global.utils;

async function status(ctx) {}

async function testSocketIo(ctx) {
  leemons.socket.emit(ctx.state.userSession.id, 'gatitos', {
    gatitos: [1, 2, 3, 4],
  });
  ctx.status = 200;
  ctx.body = { status: 200 };
}

async function todayQuote(ctx) {
  const data = await fetchJson('https://zenquotes.io/api/today');
  ctx.status = 200;
  ctx.body = { status: 200, data };
}

module.exports = {
  status,
  testSocketIo,
  todayQuote,
};
