const addManualActivity = require('../../core/manualActivities/add');
const listManualActivitiesForClassAndPeriod = require('../../core/manualActivities/list');
const removeManualActivity = require('../../core/manualActivities/remove');
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
      startDate: 'string',
      endDate: 'string',
    },
    async handler(ctx) {
      const { classId, startDate, endDate } = ctx.params;
      const manualActivities = await listManualActivitiesForClassAndPeriod({
        classId,
        startDate,
        endDate,
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
    async handler(ctx) {
      const { id } = ctx.params;
      const removed = await removeManualActivity({ id, ctx });

      return {
        removed,
        status: 200,
      };
    },
  },
};

module.exports = restActions;
