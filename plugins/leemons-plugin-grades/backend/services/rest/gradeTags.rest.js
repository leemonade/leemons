/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const {
  addGradeTag,
  updateGradeTag,
  removeGradeTag,
} = require('../../core/grade-tags');

const postGradeTagRest = require('./openapi/gradeTags/postGradeTagRest');
const putGradeTagRest = require('./openapi/gradeTags/putGradeTagRest');
const removeGradeTagRest = require('./openapi/gradeTags/removeGradeTagRest');
/** @type {ServiceSchema} */
module.exports = {
  // TODO Mirar si deberiamos de meter permisos a los endpoinds
  postGradeTagRest: {
    openapi: postGradeTagRest.openapi,
    rest: {
      path: '/',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const gradeTag = await addGradeTag({ data: ctx.params, ctx });
      return { status: 200, gradeTag };
    },
  },
  putGradeTagRest: {
    openapi: putGradeTagRest.openapi,
    rest: {
      path: '/',
      method: 'PUT',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const gradeTag = await updateGradeTag({ data: ctx.params, ctx });
      return { status: 200, gradeTag };
    },
  },
  removeGradeTagRest: {
    openapi: removeGradeTagRest.openapi,
    rest: {
      path: '/:id',
      method: 'DELETE',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      await removeGradeTag({ id: ctx.params.id, ctx });
      return { status: 200 };
    },
  },
};
