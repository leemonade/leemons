const addRetake = require('../../core/retakes/add');
const deleteRetake = require('../../core/retakes/delete');
const getRetakes = require('../../core/retakes/get');

/** @type {import('moleculer').ServiceActionsSchema} */
const restActions = {
  addRetake: {
    rest: {
      path: '/:classId/:period',
      method: 'POST',
    },
    params: {
      classId: { type: 'string' },
      period: { type: 'string' },
    },
    async handler(ctx) {
      const { classId, period } = ctx.params;

      const retakeId = await addRetake({
        retake: {
          classId,
          period,
        },
        ctx,
      });

      return {
        status: 201,
        data: retakeId,
      };
    },
  },
  getRetakes: {
    rest: {
      path: '/:classId/:period',
      method: 'GET',
    },
    params: {
      classId: { type: 'string' },
      period: { type: 'string' },
    },
    async handler(ctx) {
      const { classId, period } = ctx.params;

      const retakes = await getRetakes({
        classId,
        period,
        ctx,
      });

      return {
        status: 200,
        data: retakes,
      };
    },
  },
  deleteRetake: {
    rest: {
      path: '/:retakeId',
      method: 'DELETE',
    },
    params: {
      retakeId: { type: 'string' },
    },
    async handler(ctx) {
      const { retakeId } = ctx.params;

      const deletedCount = await deleteRetake({
        retakeId,
        ctx,
      });

      return {
        status: 200,
        deleted: deletedCount > 0,
      };
    },
  },
};

module.exports = restActions;
