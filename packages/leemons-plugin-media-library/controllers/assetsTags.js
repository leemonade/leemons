const add = require('../src/services/assets/tags/add');
const get = require('../src/services/assets/tags/get');
const getAssets = require('../src/services/assets/tags/getAssets');
const has = require('../src/services/assets/tags/has');
const remove = require('../src/services/assets/tags/remove');

module.exports = {
  add: async (ctx) => {
    const { id } = ctx.request.params;
    const { tags } = ctx.request.body;

    try {
      const added = await add(id, tags);
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
    const { id, tag } = ctx.request.params;

    try {
      const deleted = await remove(id, tag);
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
      const tags = await get(id);
      ctx.status = 200;
      ctx.body = {
        status: 200,
        tags,
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
    const { id, tag } = ctx.request.params;

    try {
      const result = await has(id, tag);
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
    const { tags, details } = ctx.request.query;

    try {
      const assets = await getAssets(JSON.parse(tags), { details: details !== 'false' });
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
