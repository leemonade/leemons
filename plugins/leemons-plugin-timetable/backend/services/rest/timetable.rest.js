/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const create = require('../../core/timetables/create');
const get = require('../../core/timetables/get');
const count = require('../../core/timetables/count');
const update = require('../../core/timetables/update');
const deleteOne = require('../../core/timetables/delete');

const createRest = require('./openapi/timetable/createRest');
const getRest = require('./openapi/timetable/getRest');
const countRest = require('./openapi/timetable/countRest');
const updateRest = require('./openapi/timetable/updateRest');
const deleteRest = require('./openapi/timetable/deleteRest');
/** @type {ServiceSchema} */
module.exports = {
  createRest: {
    openapi: createRest.openapi,
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'timetable.timetable': {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const timetable = await create({ ...ctx.params, ctx });
      return {
        status: 200,
        timetable,
      };
    },
  },
  getRest: {
    openapi: getRest.openapi,
    rest: {
      method: 'GET',
      path: '/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'timetable.timetable': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      let startBetween = ctx.params.startBetween || undefined;
      let endBetween = ctx.params.endBetween || undefined;
      if (_.isString(startBetween)) startBetween = JSON.parse(startBetween);
      if (_.isString(endBetween)) endBetween = JSON.parse(endBetween);
      const timetable = await get({
        classId: ctx.params.id,
        start: ctx.params.start,
        end: ctx.params.end,
        // Parse the arrays as JSONs (for the query). To use it, provide the times as strings.
        startBetween,
        endBetween,
        ctx,
      });
      return {
        status: 200,
        timetable,
      };
    },
  },
  countRest: {
    openapi: countRest.openapi,
    rest: {
      method: 'GET',
      path: '/count/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'timetable.timetable': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      let startBetween = ctx.params.startBetween || undefined;
      let endBetween = ctx.params.endBetween || undefined;
      let days = ctx.params.days || undefined;
      if (_.isString(startBetween)) startBetween = JSON.parse(startBetween);
      if (_.isString(endBetween)) endBetween = JSON.parse(endBetween);
      if (_.isString(days)) days = JSON.parse(days);
      const c = await count({
        classId: ctx.params.id,
        start: ctx.params.start,
        end: ctx.params.end,
        // Parse the arrays as JSONs (for the query). To use it, provide the times as strings.
        startBetween,
        endBetween,
        days,
        ctx,
      });
      return {
        status: 200,
        count: c,
      };
    },
  },
  updateRest: {
    openapi: updateRest.openapi,
    rest: {
      method: 'PUT',
      path: '/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'timetable.timetable': {
            actions: ['admin', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      let startBetween = ctx.params.startBetween || undefined;
      let endBetween = ctx.params.endBetween || undefined;
      let days = ctx.params.days || undefined;
      if (_.isString(startBetween)) startBetween = JSON.parse(startBetween);
      if (_.isString(endBetween)) endBetween = JSON.parse(endBetween);
      if (_.isString(days)) days = JSON.parse(days);
      const timetable = await update({
        ...ctx.params,
        timetableId: ctx.params.id,
        ctx,
      });
      return {
        status: 200,
        timetable,
      };
    },
  },
  deleteRest: {
    openapi: deleteRest.openapi,
    rest: {
      method: 'DELETE',
      path: '/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'timetable.timetable': {
            actions: ['admin', 'delete'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const deleted = await deleteOne({
        timetableId: ctx.params.id,
        ctx,
      });
      return {
        status: 200,
        deleted,
      };
    },
  },
};
