const add = require('../src/services/task/assessmentCriteria/add');
const get = require('../src/services/task/assessmentCriteria/get');
const list = require('../src/services/task/assessmentCriteria/list');
const remove = require('../src/services/task/assessmentCriteria/remove');

module.exports = {
  add: async (ctx) => {
    try {
      const { task } = ctx.request.params;
      const { assessmentCriteria } = ctx.request.body;

      const response = await add(task, assessmentCriteria);

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
      const { assessmentCriteria } = ctx.request.query;

      const response = await remove(task, JSON.parse(assessmentCriteria));

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
      const items = await list();

      ctx.status = 200;
      ctx.body = {
        status: 200,
        assessmentCriteria: items,
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
