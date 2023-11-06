/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsValidator } = require('@leemons/validator');

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const _ = require('lodash');
const {
  getDataForKeys,
  addCurriculum,
  listCurriculums,
  generateCurriculumNodesFromAcademicPortfolioByNodeLevels,
  publishCurriculum,
  deleteCurriculum,
  curriculumByIds,
} = require('../../core/curriculum');

// TODO [Importante]: Añadir autenticación y permisos
/** @type {ServiceSchema} */
module.exports = {
  getDataForKeysRest: {
    rest: {
      method: 'POST',
      path: '/data-for-keys',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const data = await getDataForKeys({ ...ctx.params, ctx });
      return { status: 200, data };
    },
  },
  postCurriculumRest: {
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const curriculum = await addCurriculum({ data: ctx.params, ctx });
      return { status: 200, curriculum };
    },
  },
  listCurriculumRest: {
    rest: {
      method: 'GET',
      path: '/',
    },

    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          page: { type: ['number', 'string'] },
          size: { type: ['number', 'string'] },
          canListUnpublished: { type: ['number', 'string'] },
        },
        required: ['page', 'size'],
        additionalProperties: true,
      });
      if (validator.validate(ctx.params)) {
        const { page, size, canListUnpublished, ...query } = ctx.params;
        const can = _.isString(canListUnpublished)
          ? canListUnpublished === 'true'
          : canListUnpublished;
        const data = await listCurriculums({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          canListUnpublished: can,
          query,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  generateCurriculumRest: {
    rest: {
      method: 'POST',
      path: '/:id/generate',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const curriculum = await generateCurriculumNodesFromAcademicPortfolioByNodeLevels({
        curriculumId: ctx.params.id,
        ctx,
      });
      return { status: 200, curriculum };
    },
  },
  publishCurriculumRest: {
    rest: {
      method: 'POST',
      path: '/:id/publish',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      await publishCurriculum({
        curriculumId: ctx.params.id,
        ctx,
      });
      return { status: 200 };
    },
  },
  deleteCurriculumRest: {
    rest: {
      method: 'DELETE',
      path: '/:id',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      await deleteCurriculum({
        curriculumId: ctx.params.id,
        ctx,
      });
      return { status: 200 };
    },
  },
  getCurriculumRest: {
    rest: {
      method: 'POST',
      path: '/:id',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const [curriculum] = await curriculumByIds({
        ids: ctx.params.id,
        ...ctx.params,
        ctx,
      });
      return { status: 200, curriculum };
    },
  },
};
