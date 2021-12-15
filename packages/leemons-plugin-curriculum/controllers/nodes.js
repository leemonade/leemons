const _ = require('lodash');
const nodesService = require('../src/services/nodes');

async function postNode(ctx) {
  const node = await nodesService.addNode(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, node };
}

async function saveNodeFormValues(ctx) {
  const node = await nodesService.saveNodeFormValues(
    ctx.request.params.id,
    ctx.state.userSession,
    ctx.request.body
  );
  ctx.status = 200;
  ctx.body = { status: 200, node };
}

module.exports = {
  postNode,
  saveNodeFormValues,
};
