const _ = require('lodash');
const curriculumService = require('../src/services/curriculum');

async function postCurriculum(ctx) {
  const curriculum = await curriculumService.addCurriculum(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, curriculum };
}

async function getCurriculum(ctx) {
  await curriculumService.recalculeAllIndexes(ctx.request.params.id, ctx.state.userSession);
  const [curriculum] = await curriculumService.curriculumByIds(ctx.request.params.id, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, curriculum };
}

async function generateCurriculum(ctx) {
  const curriculum =
    await curriculumService.generateCurriculumNodesFromAcademicPortfolioByNodeLevels(
      ctx.request.params.id
    );
  ctx.status = 200;
  ctx.body = { status: 200, curriculum };
}

async function listCurriculum(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
      query: {
        type: 'object',
        additionalProperties: true,
      },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const { page, size, query, ...options } = ctx.request.query;
    const data = await curriculumService.listCurriculums(parseInt(page, 10), parseInt(size, 10), {
      query,
      ...options,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

module.exports = {
  getCurriculum,
  postCurriculum,
  listCurriculum,
  generateCurriculum,
};
