const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');

const addManualActivity = require('../../core/manualActivities/add');
const listManualActivitiesForClassAndPeriod = require('../../core/manualActivities/list');
const removeManualActivity = require('../../core/manualActivities/remove');
const getScores = require('../../core/manualActivities/scores/get');
const getMyScores = require('../../core/manualActivities/scores/myScores');
const setScores = require('../../core/manualActivities/scores/set');
const updateManualActivity = require('../../core/manualActivities/upate');

const restActions = {
  add: {
    rest: {
      method: 'POST',
      path: '/',
    },
    params: {
      manualActivity: 'object',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { manualActivity } = ctx.params;

      const id = await addManualActivity({ manualActivity, ctx });

      return {
        id,
        status: 201,
      };
    },
  },
  listForClassAndPeriod: {
    rest: {
      method: 'GET',
      path: '/class/:classId',
    },
    params: {
      classId: 'string',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { classId, startDate, endDate, search } = ctx.params;
      const manualActivities = await listManualActivitiesForClassAndPeriod({
        classId,
        startDate,
        endDate,
        search,
        ctx,
      });

      return {
        data: manualActivities,
        status: 200,
      };
    },
  },
  update: {
    rest: {
      method: 'PUT',
      path: '/:id',
    },
    params: {
      id: 'string',
      manualActivity: 'object',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { id, manualActivity } = ctx.params;

      const updated = await updateManualActivity({ id, manualActivity, ctx });

      return {
        ...updated,
        status: 200,
      };
    },
  },
  remove: {
    rest: {
      method: 'DELETE',
      path: '/:id',
    },
    params: {
      id: 'string',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { id } = ctx.params;
      const removed = await removeManualActivity({ id, ctx });

      return {
        removed,
        status: 200,
      };
    },
  },

  setScores: {
    rest: {
      method: 'PUT',
      path: '/scores',
    },
    params: {
      scores: 'array',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { scores } = ctx.params;
      const data = await setScores({ scores, ctx });

      return {
        data,
        status: 200,
      };
    },
  },
  getScores: {
    rest: {
      method: 'GET',
      path: '/scores/class/:classId',
    },
    params: {
      classId: 'string',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { classId } = ctx.params;
      const data = await getScores({ classId, ctx });

      return {
        data,
        status: 200,
      };
    },
  },
  getMyScores: {
    rest: {
      method: 'GET',
      path: '/scores/class/:classId/user/me',
    },
    params: {
      classId: 'string',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { classId } = ctx.params;
      const data = await getMyScores({ classId, ctx });

      return {
        data,
        status: 200,
      };
    },
  },
};

module.exports = restActions;
