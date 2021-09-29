const treeService = require('../src/services/tree');

async function detail(ctx) {
  const treeDetail = await treeService.detail();
  ctx.status = 200;
  ctx.body = { status: 200, detail: treeDetail };
}

module.exports = {
  detail,
};
