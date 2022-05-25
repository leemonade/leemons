const _ = require('lodash');
const questionsService = require('../src/services/questions');

async function getDetails(ctx) {
  const questions = await questionsService.getByIds(ctx.request.body.questions, {
    options: ctx.request.body.options,
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, questions };
}

module.exports = {
  getDetails,
};
