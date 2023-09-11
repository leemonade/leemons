/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsValidator } = require('leemons-validator');

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('leemons-middlewares');

const getScores = require('../../core/scores/getScores');
const setScores = require('../../core/scores/setScores');
const removeScores = require('../../core/scores/removeScores');

/** @type {ServiceSchema} */
module.exports = {
  getRest: {
    rest: {
      method: 'GET',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const query = ctx.params;
      const scores = await getScores({
        students: query.students ? JSON.parse(query.students) : undefined,
        classes: query.classes ? JSON.parse(query.classes) : undefined,
        gradedBy: query.gradedBy ? JSON.parse(query.gradedBy) : undefined,
        periods: query.periods ? JSON.parse(query.periods) : undefined,
        published: query.published ? query.published === 'true' : undefined,
        ctx,
      });
      return { status: 200, scores };
    },
  },
  setRest: {
    rest: {
      method: 'PATCH',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const scores = ctx.params.scores.map((score) => ({
        student: score.student,
        class: score.class,
        period: score.period,
        grade: score.grade,
        gradedBy: ctx.meta.userSession.userAgents[0].id,
        published: score.published || false,
      }));
      await setScores({ scores, ctx });
      return { status: 200, message: 'Scores set' };
    },
  },
  removeRest: {
    rest: {
      method: 'DELETE',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const query = ctx.params;
      await removeScores({
        students: query.students ? JSON.parse(query.students) : undefined,
        classes: query.classes ? JSON.parse(query.classes) : undefined,
        gradedBy: query.gradedBy ? JSON.parse(query.gradedBy) : undefined,
        periods: query.periods ? JSON.parse(query.periods) : undefined,
        published: query.published ? query.published === 'true' : undefined,
        ctx,
      });
      return { status: 200, message: 'Scores removed' };
    },
  },
};
