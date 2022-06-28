const _ = require('lodash');
const testsService = require('../src/services/tests');

async function listTests(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
      published: { type: ['boolean', 'string'] },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const { page, size, ...options } = ctx.request.query;
    if (options.published === 'true') {
      options.published = true;
    } else if (options.published === 'false') {
      options.published = false;
    }
    const data = await testsService.list(parseInt(page, 10), parseInt(size, 10), {
      ...options,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

async function saveTest(ctx) {
  const data = JSON.parse(ctx.request.body.data);
  _.forIn(ctx.request.files, (value, key) => {
    _.set(data, key, value);
  });
  const test = await testsService.save(data, { userSession: ctx.state.userSession });
  ctx.status = 200;
  ctx.body = { status: 200, test };
}

async function getTest(ctx) {
  const [test] = await testsService.details(ctx.request.params.id, {
    withQuestionBank: ctx.request.query.withQuestionBank === 'true',
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, test };
}

async function setInstanceTimestamp(ctx) {
  const { timestamps } = await testsService.setInstanceTimestamp(
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

async function setQuestionResponse(ctx) {
  const question = await testsService.setQuestionResponse(ctx.request.body, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, question };
}

async function getUserQuestionResponses(ctx) {
  const responses = await testsService.getUserQuestionResponses(
    ctx.request.params.id,
    ctx.request.query.user || ctx.state.userSession.userAgents[0].id,
    {
      userSession: ctx.state.userSession,
    }
  );
  ctx.status = 200;
  ctx.body = { status: 200, responses };
}

async function deleteTest(ctx) {
  await testsService.deleteTest(ctx.request.params.id, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, deleted: true };
}

async function assignTest(ctx) {
  const test = await testsService.assign(ctx.request.body, {
    userSession: ctx.state.userSession,
    ctx,
  });
  ctx.status = 200;
  ctx.body = { status: 200, test };
}

async function getInstanceFeedback(ctx) {
  const feedback = await testsService.getFeedback(ctx.request.params.id, ctx.request.params.user, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, feedback };
}

async function setInstanceFeedback(ctx) {
  const feedback = await testsService.setFeedback(
    ctx.request.body.id,
    ctx.request.body.user,
    ctx.request.body.feedback,
    {
      userSession: ctx.state.userSession,
    }
  );
  ctx.status = 200;
  ctx.body = { status: 200, feedback };
}

async function getAssignConfigs(ctx) {
  const configs = await testsService.getAssignSavedConfigs(ctx.state.userSession);
  ctx.status = 200;
  ctx.body = { status: 200, configs };
}

async function duplicate(ctx) {
  try {
    const { published, id } = ctx.request.body;
    const test = await testsService.duplicate(id, {
      published,
      userSession: ctx.state.userSession,
    });

    ctx.status = 201;
    ctx.body = {
      status: 201,
      test,
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      error: error.message,
    };
  }
}

module.exports = {
  getUserQuestionResponses,
  setInstanceTimestamp,
  setQuestionResponse,
  getInstanceFeedback,
  setInstanceFeedback,
  getAssignConfigs,
  assignTest,
  deleteTest,
  duplicate,
  listTests,
  saveTest,
  getTest,
};
