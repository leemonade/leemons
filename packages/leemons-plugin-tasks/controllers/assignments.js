const createInstance = require('../src/services/assignment/instance/create');
const removeInstance = require('../src/services/assignment/instance/remove');

module.exports = {
  /**
   * Instances
   */
  instanceCreate: async (ctx) => {
    try {
      const { task } = ctx.request.params;

      const instance = await createInstance(task);

      ctx.status = 201;
      ctx.body = {
        status: 201,
        instance,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  instanceDelete: async (ctx) => {
    try {
      const { task, instance } = ctx.request.params;

      const deleted = await removeInstance(task, instance);

      ctx.status = 200;
      ctx.body = {
        status: 200,
        ...deleted,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
};
