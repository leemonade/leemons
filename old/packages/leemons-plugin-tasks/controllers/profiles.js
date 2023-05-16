const get = require('../src/services/profiles/get');
const set = require('../src/services/profiles/set');
const { profiles: profilesTable } = require('../src/services/table');

module.exports = {
  get: async (ctx) => {
    try {
      const { key } = ctx.params;

      const profile = await get(key);

      ctx.status = 200;
      ctx.body = { status: 200, profile };
    } catch (e) {
      ctx.status = 500;
      ctx.body = { status: 500, error: e.message };
    }
  },
  set: async (ctx) => {
    try {
      const { key, profile } = ctx.params;

      await set(key, profile);

      ctx.status = 200;
      ctx.body = { status: 200, key, profile };
    } catch (e) {
      ctx.status = 500;
      ctx.body = { status: 500, error: e.message };
    }
  },
  setMany: async (ctx) => {
    try {
      const { profiles } = ctx.request.body;

      global.utils.withTransaction(async (transacting) => {
        await Promise.all(profiles.map(({ profile, key }) => set(key, profile, { transacting })));
      }, profilesTable);

      ctx.status = 200;
      ctx.body = { status: 200, profiles };
    } catch (e) {
      ctx.status = 500;
      ctx.body = { status: 500, error: e.message };
    }
  },
};
