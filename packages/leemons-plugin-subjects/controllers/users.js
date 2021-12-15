module.exports = {
  search: async (ctx) => {
    try {
      const users = await leemons.plugin.services.users.search({
        query: ctx.query.q,
        profile: ctx.query.profile,
      });
      ctx.status = 200;
      ctx.body = { status: 200, users };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
};
