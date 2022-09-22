const _ = require('lodash');
const feedbackService = require('../src/services/feedback');

async function saveFeedback(ctx) {
  const data = JSON.parse(ctx.request.body.data);
  _.forIn(ctx.request.files, (value, key) => {
    _.set(data, key, value);
  });
  const feedback = await feedbackService.saveFeedback(data, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, feedback };
}

async function getFeedback(ctx) {
  const feedback = await feedbackService.getFeedback(ctx.request.params.id, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, feedback };
}

async function deleteFeedback(ctx) {
  const feedback = await feedbackService.deleteFeedback(ctx.request.params.id, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, feedback };
}

async function duplicateFeedback(ctx) {
  const feedback = await feedbackService.duplicateFeedback(ctx.request.body.id, {
    published: ctx.request.body.published,
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, feedback };
}

module.exports = {
  duplicateFeedback,
  deleteFeedback,
  saveFeedback,
  getFeedback,
};
