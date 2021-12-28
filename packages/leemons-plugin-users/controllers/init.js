async function status(ctx) {}

async function testSocketIo(ctx) {
  leemons.socket.emit(ctx.state.userSession.id, 'gatitos', {
    gatitos: [1, 2, 3, 4],
  });
  ctx.status = 200;
  ctx.body = { status: 200 };
}

async function todayQuote(ctx) {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  const data = await fetch('https://zenquotes.io/api/today', requestOptions);
  ctx.status = 200;
  ctx.body = { status: 200, data: data.json() };
}

module.exports = {
  status,
  testSocketIo,
  todayQuote,
};
