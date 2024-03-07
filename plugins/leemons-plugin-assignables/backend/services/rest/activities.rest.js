/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const searchOngoingActivities = require('../../core/ongoing/searchOngoingActivities');
const searchNyaActivities = require('../../core/ongoing/searchNyaActivities');
const searchEvaluatedActivities = require('../../core/ongoing/searchEvaluatedActivities');

/** @type {ServiceSchema} */
module.exports = {
  searchOngoingRest: {
    rest: {
      method: 'GET',
      path: '/search/ongoing',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const activities = await searchOngoingActivities({ query: ctx.params, ctx });
      return { status: 200, activities };
    },
  },
  searchNyaActivitiesRest: {
    rest: {
      method: 'GET',
      path: '/search/nya',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { params: query } = ctx;
      const activities = await searchNyaActivities({ query, ctx });
      return { status: 200, activities };
    },
  },
  searchOngoingActivitiesRest: {
    rest: {
      method: 'GET',
      path: '/search/evaluated',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const activities = await searchEvaluatedActivities({ query: ctx.params, ctx });
      return { status: 200, activities };
    },
  },
};
