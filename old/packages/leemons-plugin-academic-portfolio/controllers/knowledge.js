const knowledgeService = require('../src/services/knowledges');

async function postKnowledge(ctx) {
  const knowledge = await knowledgeService.addKnowledge(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, knowledge };
}

async function putKnowledge(ctx) {
  const knowledge = await knowledgeService.updateKnowledge(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, knowledge };
}

async function listKnowledge(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
      program: { type: 'string' },
    },
    required: ['page', 'size', 'program'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const { page, size, program, ...options } = ctx.request.query;
    const data = await knowledgeService.listKnowledges(
      parseInt(page, 10),
      parseInt(size, 10),
      program,
      {
        ...options,
      }
    );
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

// TODO: AÑADIR BORRAR Y ACTUALIZAR (HAY QUE MIRAR COMO Y EN QUE AFECTA)

module.exports = {
  postKnowledge,
  listKnowledge,
  putKnowledge,
};
