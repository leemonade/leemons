const _ = require('lodash');
const feedbackService = require('../src/services/feedback');
const feedbackResponsesService = require('../src/services/feedback-responses');

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

async function assignFeedback(ctx) {
  const feedback = await feedbackService.assignFeedback(ctx.request.body, {
    userSession: ctx.state.userSession,
    ctx,
  });
  ctx.status = 200;
  ctx.body = { status: 200, feedback };
}

async function setQuestionResponse(ctx) {
  const question = await feedbackResponsesService.setQuestionResponse(ctx.request.body, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, question };
}

async function setInstanceTimestamp(ctx) {
  const { timestamps } = await feedbackService.setInstanceTimestamp(
    ctx.request.body.instance,
    ctx.request.body.timeKey,
    ctx.request.body.user || ctx.state.userSession.userAgents[0].id,
    {
      userSession: ctx.state.userSession,
    }
  );
  ctx.status = 200;
  ctx.body = { status: 200, timestamps };
}

async function getUserAssignableResponses(ctx) {
  const responses = await feedbackResponsesService.getUserAssignableResponses(
    ctx.request.params.id,
    {
      userSession: ctx.state.userSession,
    }
  );
  ctx.status = 200;
  ctx.body = { status: 200, responses };
}

async function getFeedbackResults(ctx) {
  const results = await feedbackResponsesService.getFeedbackResults(ctx.request.params.id, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, results };
}

async function getFeedbackResultsWithTime(ctx) {
  const results = await feedbackResponsesService.getFeedbackResultsWithTime(ctx.request.params.id, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, results };
}

module.exports = {
  duplicateFeedback,
  deleteFeedback,
  saveFeedback,
  getFeedback,
  assignFeedback,
  setQuestionResponse,
  setInstanceTimestamp,
  getUserAssignableResponses,
  getFeedbackResults,
  getFeedbackResultsWithTime,
};
