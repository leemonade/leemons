/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { LeemonsValidator } = require('@leemons/validator');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const {
  addGradeScale,
  updateGradeScale,
  removeGradeScale,
  canRemoveGradeScale,
} = require('../../core/grade-scales');

const postGradeScaleRest = require('./openapi/gradeScales/postGradeScaleRest');
const putGradeScaleRest = require('./openapi/gradeScales/putGradeScaleRest');
const canRemoveGradeScaleRest = require('./openapi/gradeScales/canRemoveGradeScaleRest');
const removeGradeScaleRest = require('./openapi/gradeScales/removeGradeScaleRest');
/** @type {ServiceSchema} */
module.exports = {
  // TODO Mirar si deberiamos de meter permisos a los endpoinds
  postGradeScaleRest: {
    openapi: postGradeScaleRest.openapi,
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
    openapi: putGradeScaleRest.openapi,
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
    openapi: canRemoveGradeScaleRest.openapi,
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
    openapi: removeGradeScaleRest.openapi,
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
