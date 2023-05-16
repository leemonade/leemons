const _ = require('lodash');
const questionsBanksService = require('../src/services/questions-banks');

async function listQuestionBanks(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
      published: { type: ['boolean', 'string'] },
      subjects: { type: 'array', items: { type: 'string' } },
      query: { type: 'object', additionalProperties: true },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const { page, size, ...options } = ctx.request.body;
    const data = await questionsBanksService.list(parseInt(page, 10), parseInt(size, 10), {
      ...options,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

async function saveQuestionBanks(ctx) {
  const data = JSON.parse(ctx.request.body.data);
  _.forIn(ctx.request.files, (value, key) => {
    _.set(data, key, value);
  });
  const questionBank = await questionsBanksService.save(data, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, questionBank };
}

async function getQuestionBankDetail(ctx) {
  const [questionBank] = await questionsBanksService.details(ctx.request.params.id, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, questionBank };
}

async function deleteQuestionBank(ctx) {
  await questionsBanksService.delete(ctx.request.params.id, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200 };
}

module.exports = {
  listQuestionBanks,
  saveQuestionBanks,
  getQuestionBankDetail,
  deleteQuestionBank,
};
