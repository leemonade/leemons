const register = require('../src/services/categories/register');
const exists = require('../src/services/categories/exists');
const list = require('../src/services/categories/list');
const unregister = require('../src/services/categories/unregister');

module.exports = {
  register: async (ctx) => {
    const { name, displayName } = ctx.request.body;
    try {
      const success = await register({ name, displayName }, { transacting: ctx.state.transacting });
      if (success) {
        ctx.status = 201;
        ctx.body = { created: true };
      } else {
        ctx.status = 200;
        ctx.body = { created: false };
      }
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: e.message,
      };
    }
  },
  exists: async (ctx) => {
    const { name } = ctx.request.params;
    try {
      const result = await exists({ name }, { transacting: ctx.state.transacting });
      ctx.status = 200;
      ctx.body = { exists: result };
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: e.message,
      };
    }
  },
  list: async (ctx) => {
    const { page, size } = ctx.request.query;
    try {
      const result = await list(page, size, { transacting: ctx.state.transacting });
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
  unregister: async (ctx) => {
    const { name } = ctx.request.params;
    try {
      const deleted = await unregister({ name }, { transacting: ctx.state.transacting });
      ctx.status = 200;
      ctx.body = { status: 200, deleted };
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: e.message,
      };
    }
  },
};
