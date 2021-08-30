const services = leemons.plugin.services.levels;

module.exports = {
  add: async (ctx) => {
    try {
      const level = await services.add(ctx.request.body);
      ctx.body = { ok: true, level };
    } catch (e) {
      ctx.body = { ok: false, error: e.message };
    }
  },
  get: async (ctx) => {
    try {
      const levelSchema = await services.get(ctx.params.id, { locale: ctx.request.body.locale });
      ctx.body = { ok: true, levelSchema };
    } catch (e) {
      ctx.body = { ok: false, error: e.message };
    }
  },
  list: async (ctx) => {
    try {
      const items = await services.list({ locale: ctx.request.body.locale });
      ctx.body = { ok: true, items };
    } catch (e) {
      ctx.body = { ok: false, error: e.message };
    }
  },
  delete: async (ctx) => {
    try {
      await services.delete(ctx.params.id);
      ctx.body = { ok: true };
    } catch (e) {
      ctx.body = { ok: false, error: e.message };
    }
  },
  setNames: async (ctx) => {
    try {
      const names = await services.setNames(ctx.request.params.id, ctx.request.body.names);
      ctx.body = { ok: true, names };
    } catch (e) {
      ctx.body = { ok: false, error: e.message };
    }
  },
  setDescriptions: async (ctx) => {
    try {
      const names = await services.setDescriptions(
        ctx.request.params.id,
        ctx.request.body.descriptions
      );
      ctx.body = { ok: true, names };
    } catch (e) {
      ctx.body = { ok: false, error: e.message };
    }
  },
  setParent: async (ctx) => {
    try {
      const levelSchema = await services.setParent(ctx.request.params.id, ctx.request.body.parent);
      ctx.body = { ok: true, levelSchema };
    } catch (e) {
      ctx.body = { ok: false, error: e.message };
    }
  },
};
