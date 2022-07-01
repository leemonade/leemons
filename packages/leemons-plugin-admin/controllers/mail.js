module.exports = {
  getProviders: async (ctx) => {
    try {
      const providers = await leemons.getPlugin('emails').services.email.providers();
      ctx.status = 200;
      ctx.body = { status: 200, providers };
    } catch (e) {
      console.error(e);
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
};
