const search = require('../src/services/search');

module.exports = {
  search: async (ctx) => {
    const { details, ...query } = ctx.request.query;
    const { userSession } = ctx.state;

    try {
      const assets = await search(query, { details: details !== 'false', userSession });
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
