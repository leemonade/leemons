/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const {
  saveFeedback,
  getFeedback,
  deleteFeedback,
  duplicateFeedback,
  assignFeedback,
  setInstanceTimestamp,
} = require('../../core/feedback');
const {
  setQuestionResponse,
  getUserAssignableResponses,
  getFeedbackResults,
  getFeedbackResultsWithTime,
} = require('../../core/feedback-responses');

const saveFeedbackRest = require('./openapi/feedback/saveFeedbackRest');
const getFeedbackRest = require('./openapi/feedback/getFeedbackRest');
const deleteFeedbackRest = require('./openapi/feedback/deleteFeedbackRest');
const duplicateFeedbackRest = require('./openapi/feedback/duplicateFeedbackRest');
const assignFeedbackRest = require('./openapi/feedback/assignFeedbackRest');
const setInstanceTimestampRest = require('./openapi/feedback/setInstanceTimestampRest');
const setQuestionResponseRest = require('./openapi/feedback/setQuestionResponseRest');
const getUserAssignableResponsesRest = require('./openapi/feedback/getUserAssignableResponsesRest');
const getFeedbackResultsRest = require('./openapi/feedback/getFeedbackResultsRest');
const getFeedbackResultsWithTimeRest = require('./openapi/feedback/getFeedbackResultsWithTimeRest');
/** @type {ServiceSchema} */
module.exports = {
  saveFeedbackRest: {
    openapi: saveFeedbackRest.openapi,
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'feedback.feedback': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const feedback = await saveFeedback({
        data: ctx.params,
        ctx,
      });
      return { status: 200, feedback };
    },
  },
  getFeedbackRest: {
    openapi: getFeedbackRest.openapi,
    rest: {
      method: 'GET',
      path: '/:id',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const feedback = await getFeedback({
        id: ctx.params.id,
        ctx,
      });
      return { status: 200, feedback };
    },
  },
  deleteFeedbackRest: {
    openapi: deleteFeedbackRest.openapi,
    rest: {
      method: 'DELETE',
      path: '/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'feedback.feedback': {
            actions: ['admin', 'delete'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const feedback = await deleteFeedback({
        id: ctx.params.id,
        ctx,
      });
      return { status: 200, feedback };
    },
  },
  duplicateFeedbackRest: {
    openapi: duplicateFeedbackRest.openapi,
    rest: {
      method: 'POST',
      path: '/duplicate',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'feedback.feedback': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const feedback = await duplicateFeedback({
        ...ctx.params,
        ctx,
      });
      return { status: 200, feedback };
    },
  },
  assignFeedbackRest: {
    openapi: assignFeedbackRest.openapi,
    rest: {
      method: 'POST',
      path: '/assign',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'feedback.feedback': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const feedback = await assignFeedback({
        ...ctx.params,
        ctx,
      });
      return { status: 200, feedback };
    },
  },
  setInstanceTimestampRest: {
    openapi: setInstanceTimestampRest.openapi,
    rest: {
      method: 'POST',
      path: '/instance/timestamp',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { timestamps } = await setInstanceTimestamp({
        instanceId: ctx.params.instance,
        timeKey: ctx.params.timeKey,
        user: ctx.params.user || ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, timestamps };
    },
  },
  setQuestionResponseRest: {
    openapi: setQuestionResponseRest.openapi,
    rest: {
      method: 'POST',
      path: '/instance/question/response',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const question = await setQuestionResponse({
        data: ctx.params,
        ctx,
      });
      return { status: 200, question };
    },
  },
  getUserAssignableResponsesRest: {
    openapi: getUserAssignableResponsesRest.openapi,
    rest: {
      method: 'GET',
      path: '/instance/responses/:id',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const responses = await getUserAssignableResponses({
        instanceId: ctx.params.id,
        ctx,
      });
      return { status: 200, responses };
    },
  },
  getFeedbackResultsRest: {
    openapi: getFeedbackResultsRest.openapi,
    rest: {
      method: 'GET',
      path: '/results/:id',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const results = await getFeedbackResults({
        id: ctx.params.id,
        ctx,
      });
      return { status: 200, results };
    },
  },
  getFeedbackResultsWithTimeRest: {
    openapi: getFeedbackResultsWithTimeRest.openapi,
    rest: {
      method: 'GET',
      path: '/results/time/:id',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const results = await getFeedbackResultsWithTime({
        instanceId: ctx.params.id,
        ctx,
      });
      return { status: 200, results };
    },
  },
};
