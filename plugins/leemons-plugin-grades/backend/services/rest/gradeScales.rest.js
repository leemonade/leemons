/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { LeemonsValidator } = require('leemons-validator');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('leemons-middlewares');
const {
  addGradeScale,
  updateGradeScale,
  removeGradeScale,
  canRemoveGradeScale,
} = require('../../core/grade-scales');

/** @type {ServiceSchema} */
module.exports = {
  // TODO Mirar si deberiamos de meter permisos a los endpoinds
  postGradeScaleRest: {
    rest: {
      path: '/',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const gradeScale = await addGradeScale({ data: ctx.params, ctx });
      return { status: 200, gradeScale };
    },
  },
  putGradeScaleRest: {
    rest: {
      path: '/',
      method: 'PUT',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const gradeScale = await updateGradeScale({ data: ctx.params, ctx });
      return { status: 200, gradeScale };
    },
  },
  canRemoveGradeScaleRest: {
    rest: {
      path: '/can/:id',
      method: 'DELETE',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      await canRemoveGradeScale({ id: ctx.params.id, ctx });
      return { status: 200 };
    },
  },
  removeGradeScaleRest: {
    rest: {
      path: '/:id',
      method: 'DELETE',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      await removeGradeScale({ id: ctx.params.id, ctx });
      return { status: 200 };
    },
  },
};
