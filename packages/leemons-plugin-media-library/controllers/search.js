const search = require('../src/services/search');

module.exports = {
  search: async (ctx) => {
    const { query } = ctx.request;
    const { userSession } = ctx.state;

    try {
      const assets = await search(query, { userSession });
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
