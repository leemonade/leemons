module.exports = {
  ...leemons.getPlugin('common').services.tags.getControllerFunctions('plugins.tasks'),
};

/*
const add = require('../src/services/tags/add');
const get = require('../src/services/tags/get');
const has = require('../src/services/tags/has');
const list = require('../src/services/tags/list');
const remove = require('../src/services/tags/remove');

module.exports = {
  add: async (ctx) => {
    try {
      const { task } = ctx.request.params;
      const { tags } = ctx.request.body;

      const response = await add(task, tags);

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
  has: async (ctx) => {
    try {
      const { task } = ctx.request.params;
      const { tags } = ctx.request.query;

      const response = await has(task, JSON.parse(tags));

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
      const { tags } = ctx.request.query;

      const response = await remove(task, JSON.parse(tags));

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
      const tags = await list();

      ctx.status = 200;
      ctx.body = {
        status: 200,
        tags,
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
*/
