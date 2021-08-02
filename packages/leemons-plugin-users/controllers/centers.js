const centerService = require('../src/services/centers');

async function list(ctx) {
  const centers = await centerService.list();
  ctx.status = 200;
  ctx.body = { status: 200, centers };
}

module.exports = {
  list,
};
