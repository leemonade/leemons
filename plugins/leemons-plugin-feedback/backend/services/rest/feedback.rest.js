/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsValidator } = require('@leemons/validator');
const _ = require('lodash');

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

/** @type {ServiceSchema} */
module.exports = {
  saveFeedbackRest: {
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
