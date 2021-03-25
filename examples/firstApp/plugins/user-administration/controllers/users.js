const register = (ctx) => {
  ctx.body = `The user has been registered`;
};

const reload = (ctx) => {
  global.leemons.reload();
  ctx.body = { msg: 'The server is reloading' };
};

module.exports = { register, reload };
