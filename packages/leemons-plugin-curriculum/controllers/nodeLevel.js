const _ = require('lodash');
const nodeLevelsService = require('../src/services/nodeLevels');

async function postNodeLevels(ctx) {
  const nodeLevels = await nodeLevelsService.addNodeLevels(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, nodeLevels };
}

module.exports = {
  postNodeLevels,
};
