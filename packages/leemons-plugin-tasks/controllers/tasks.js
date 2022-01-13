const create = require('../src/services/task/create');
const get = require('../src/services/task/get');
const remove = require('../src/services/task/remove');
const update = require('../src/services/task/update');

module.exports = {
  create: async (ctx) => {
    try {
      const {
        tagline,
        level,
        summary,
        cover,
        color,
        methodology,
        recommendedDuration,
        statement,
        development,
        submissions,
        selfReflection,
        feedback,
        instructionsForTeacher,
        instructionsForStudent,
        state,
      } = ctx.request.body;

      let task = {
        tagline,
        level,
        summary,
        cover,
        color,
        methodology,
        recommendedDuration,
        statement,
        development,
        submissions,
        selfReflection,
        feedback,
        instructionsForTeacher,
        instructionsForStudent,
        state,
      };

      task = await create(task);

      ctx.status = 201;
      ctx.body = {
        status: 201,
        task,
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: error.message,
      };
    }
  },
  update: async (ctx) => {
    try {
      const { id } = ctx.params;
      const {
        tagline,
        level,
        summary,
        cover,
        color,
        methodology,
        recommendedDuration,
        statement,
        development,
        submissions,
        selfReflection,
        feedback,
        instructionsForTeacher,
        instructionsForStudent,
        state,
      } = ctx.request.body;

      let task = {
        tagline,
        level,
        summary,
        cover,
        color,
        methodology,
        recommendedDuration,
        statement,
        development,
        submissions,
        selfReflection,
        feedback,
        instructionsForTeacher,
        instructionsForStudent,
        state,
      };

      task = await update(id, task);

      ctx.status = 200;
      ctx.body = {
        status: 200,
        task,
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: error.message,
      };
    }
  },
  get: async (ctx) => {
    try {
      const { id } = ctx.params;

      const task = await get(id);

      ctx.status = 200;
      ctx.body = {
        status: 200,
        task,
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: error.message,
      };
    }
  },
  remove: async (ctx) => {
    try {
      const { id } = ctx.params;

      const deleted = await remove(id);

      ctx.status = 200;
      ctx.body = {
        status: 200,
        ...deleted,
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: error.message,
      };
    }
  },
};
