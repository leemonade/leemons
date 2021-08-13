const treeService = require('../src/services/tree');

async function detail(ctx) {
  const detail = await treeService.detail();
  ctx.status = 200;
  ctx.body = { status: 200, detail };
}

module.exports = {
  detail,
};
