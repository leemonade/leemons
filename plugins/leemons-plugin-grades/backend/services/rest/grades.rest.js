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
  listGrades,
  addGrade,
  updateGrade,
  haveGrades,
  gradeByIds,
  removeGrade,
} = require('../../core/grades');

/** @type {ServiceSchema} */
module.exports = {
  // TODO Mirar si deberiamos de meter permisos a los endpoinds
  listGradesRest: {
    rest: {
      path: '/',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          page: { type: ['number', 'string'] },
          size: { type: ['number', 'string'] },
          center: { type: ['string'] },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const { page, size, center, ...options } = ctx.params;
        const data = await listGrades({
          ...options,
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          center,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  postGradeRest: {
    rest: {
      path: '/',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const grade = await addGrade({
        data: ctx.params,
        fromFrontend: true,
        ctx,
      });
      return { status: 200, grade };
    },
  },
  putGradeRest: {
    rest: {
      path: '/',
      method: 'PUT',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const grade = await updateGrade({
        data: ctx.params,
        ctx,
      });
      return { status: 200, grade };
    },
  },
  haveGradesRest: {
    rest: {
      path: '/have',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const have = await haveGrades({
        ctx,
      });
      return { status: 200, have };
    },
  },
  getGradeRest: {
    rest: {
      path: '/:id',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const [grade] = await gradeByIds({
        ids: [ctx.params.id],
        ctx,
      });
      return { status: 200, grade };
    },
  },
  removeGradeRest: {
    rest: {
      path: '/:id',
      method: 'DELETE',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      await removeGrade({
        id: ctx.params.id,
        ctx,
      });
      return { status: 200 };
    },
  },
};
