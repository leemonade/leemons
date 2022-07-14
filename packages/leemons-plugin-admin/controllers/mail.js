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
  getPlatformEmail: async (ctx) => {
    try {
      const email = await leemons.getPlugin('users').services.platform.getEmail();
      ctx.status = 200;
      ctx.body = { status: 200, email };
    } catch (e) {
      console.error(e);
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  savePlatformEmail: async (ctx) => {
    try {
      const email = await leemons
        .getPlugin('users')
        .services.platform.setEmail(ctx.request.body.email);
      ctx.status = 200;
      ctx.body = { status: 200, email };
    } catch (e) {
      console.error(e);
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
};
