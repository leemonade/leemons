const add = require('../src/services/attachments/add');
const get = require('../src/services/attachments/get');
const remove = require('../src/services/attachments/remove');

module.exports = {
  add: async (ctx) => {
    try {
      const { task } = ctx.params;
      const { attachments } = ctx.request.body;

      const result = await add(task, attachments);

      ctx.status = 201;
      ctx.body = { status: 201, ...result };
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: e.message,
      };
    }
  },
  get: async (ctx) => {
    try {
      const { task } = ctx.params;

      const result = await get(task);

      ctx.status = 200;
      ctx.body = { status: 200, ...result };
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: e.message,
      };
    }
  },
  remove: async (ctx) => {
    try {
      const { task } = ctx.params;
      const { attachments } = ctx.request.query;

      const result = await remove(task, JSON.parse(attachments));

      ctx.status = 200;
      ctx.body = { status: 200, ...result };
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: e.message,
      };
    }
  },
};
