const add = require('../src/services/assets/categories/add');
const get = require('../src/services/assets/categories/get');
const getAssets = require('../src/services/assets/categories/getAssets');
const has = require('../src/services/assets/categories/has');
const remove = require('../src/services/assets/categories/remove');

module.exports = {
  add: async (ctx) => {
    const { id, category } = ctx.request.params;

    try {
      const added = await add({ id }, { name: category });
      if (added) {
        ctx.status = 201;
        ctx.body = {
          status: 201,
          added,
        };
      } else {
        ctx.status = 200;
        ctx.body = {
          status: 200,
          added,
        };
      }
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        error: e.message,
      };
    }
  },

  remove: async (ctx) => {
    const { id, category } = ctx.request.params;

    try {
      const deleted = await remove({ id }, { name: category });
      ctx.status = 200;
      ctx.body = {
        status: 200,
        deleted,
      };
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        error: e.message,
      };
    }
  },

  get: async (ctx) => {
    const { id } = ctx.request.params;

    try {
      const categories = await get({ id });
      ctx.status = 200;
      ctx.body = {
        status: 200,
        categories,
      };
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        error: e.message,
      };
    }
  },

  has: async (ctx) => {
    const { id, category } = ctx.request.params;

    try {
      const result = await has({ id }, { name: category });
      ctx.status = 200;
      ctx.body = {
        status: 200,
        has: result,
      };
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        error: e.message,
      };
    }
  },

  getAssets: async (ctx) => {
    const { category } = ctx.request.params;
    const { details } = ctx.request.query;
    try {
      const assets = await getAssets(category, { details: details !== 'false' });
      ctx.status = 200;
      ctx.body = { status: 200, assets };
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: e.message,
      };
    }
  },
};
