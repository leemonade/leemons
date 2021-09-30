module.exports = {
  exists: async (ctx) => {
    const result = await leemons.plugin.services.teaching.exists(ctx.request.body.items, {
      useNames: ctx.request.body.useNames,
    });
    ctx.body = { result };
  },
  create: async (ctx) => {
    const result = await leemons.plugin.services.teaching.create(ctx.request.body.items);
    ctx.body = { result };
  },
  update: async (ctx) => {
    const result = await leemons.plugin.services.teaching.update(ctx.request.body.items);
    ctx.body = { result };
  },
};
