const knowledgeService = require('../src/services/knowledges');

async function postKnowledge(ctx) {
  const knowledge = await knowledgeService.addKnowledge(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, knowledge };
}

async function listKnowledge(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const { page, size, ...options } = ctx.request.query;
    const data = await knowledgeService.listKnowledges(parseInt(page, 10), parseInt(size, 10), {
      ...options,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

module.exports = {
  postKnowledge,
  listKnowledge,
};
