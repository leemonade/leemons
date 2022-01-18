const _ = require('lodash');
const nodesService = require('../src/services/nodes');

async function postNode(ctx) {
  const node = await nodesService.addNode(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, node };
}

async function saveNode(ctx) {
  const { id, ...rest } = ctx.request.body;
  const node = await nodesService.saveNode(id, ctx.state.userSession, rest);
  ctx.status = 200;
  ctx.body = { status: 200, node };
}

module.exports = {
  postNode,
  saveNode,
};
