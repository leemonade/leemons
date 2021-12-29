const add = require('../src/services/files/categories/add');
const get = require('../src/services/files/categories/get');
const has = require('../src/services/files/categories/has');
const remove = require('../src/services/files/categories/remove');

const { files } = require('../src/services/tables');

module.exports = {
  add: async (ctx) => {
    const { id, category } = ctx.request.params;

    try {
      // const added = await add({ id }, { name: category });
      global.utils.withTransaction(async (transacting) => {
        console.log(transacting);
      }, files);
      // if (added) {
      //   ctx.status = 201;
      //   ctx.body = {
      //     status: 201,
      //     added,
      //   };
      // } else {
      //   ctx.status = 200;
      //   ctx.body = {
      //     status: 200,
      //     added,
      //   };
      // }
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
};
