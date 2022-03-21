const add = require('../src/services/task/objectives/add');
const get = require('../src/services/task/objectives/get');
const list = require('../src/services/task/objectives/list');
const remove = require('../src/services/task/objectives/remove');

module.exports = {
  add: async (ctx) => {
    try {
      const { task } = ctx.request.params;
      const { objectives } = ctx.request.body;

      const response = await add(task, objectives);

      ctx.status = 201;
      ctx.body = {
        status: 201,
        ...response,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: e.message,
      };
    }
  },
  get: async (ctx) => {
    try {
      const { task } = ctx.request.params;

      const response = await get(task);

      ctx.status = 200;
      ctx.body = {
        status: 200,
        ...response,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: e.message,
      };
    }
  },
  remove: async (ctx) => {
    try {
      const { task } = ctx.request.params;
      const { tags: objectives } = ctx.request.query;

      const response = await remove(task, JSON.parse(objectives));

      ctx.status = 200;
      ctx.body = {
        status: 200,
        ...response,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: e.message,
      };
    }
  },
  list: async (ctx) => {
    try {
      const { objectives } = ctx.request.params;

      const items = await list();

      ctx.status = 200;
      ctx.body = {
        status: 200,
        objectives: items,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: e.message,
      };
    }
  },
};
