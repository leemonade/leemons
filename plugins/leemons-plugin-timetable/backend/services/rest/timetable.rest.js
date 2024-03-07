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

/** @type {ServiceSchema} */
module.exports = {
  createRest: {
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
