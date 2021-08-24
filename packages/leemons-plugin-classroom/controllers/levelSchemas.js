const services = leemons.plugin.services.levelSchemas;

module.exports = {
  add: async (ctx) => {
    await services.add(ctx.request.body);
    ctx.body = { ok: true };
  },
};
