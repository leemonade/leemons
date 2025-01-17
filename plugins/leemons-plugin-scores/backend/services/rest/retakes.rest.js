const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');

const addRetake = require('../../core/retakes/add');
const deleteRetake = require('../../core/retakes/delete');
const getRetakes = require('../../core/retakes/get');
const getRetakeScores = require('../../core/retakes/scores/get');
const setRetakeScore = require('../../core/retakes/scores/set');

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
    middlewares: [LeemonsMiddlewareAuthenticated()],
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
    middlewares: [LeemonsMiddlewareAuthenticated()],
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
    middlewares: [LeemonsMiddlewareAuthenticated()],
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

  gradeRetake: {
    rest: {
      path: '/grades/:classId/:period',
      method: 'PUT',
    },
    params: {
      classId: { type: 'string' },
      period: { type: 'string' },
      retakeId: { type: 'string', optional: true },
      retakeIndex: { type: 'number' },
      user: { type: 'string' },
      grade: { type: 'number' },
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { classId, period, retakeId, retakeIndex, user, grade } = ctx.params;

      const modified = await setRetakeScore({
        retakeScore: {
          class: classId,
          period,
          retakeId,
          retakeIndex,
          user,
          grade,
        },
        ctx,
      });

      return {
        status: 200,
        modified,
      };
    },
  },
  getRetakeGrades: {
    rest: {
      path: '/grades/:classId/:period',
      method: 'GET',
    },
    params: {
      classId: { type: 'string' },
      period: { type: 'string' },
      retakeId: { type: 'string', optional: true },
      retakeIndex: { type: 'number', optional: true, convert: true },
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { classId, period, retakeId, retakeIndex, user } = ctx.params;

      const retakeScores = await getRetakeScores({
        class: classId,
        period,
        retakeId,
        retakeIndex,
        user,
        ctx,
      });

      return {
        status: 200,
        data: retakeScores,
      };
    },
  },
};

module.exports = restActions;
