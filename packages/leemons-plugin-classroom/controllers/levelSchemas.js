const services = leemons.plugin.services.levelSchemas;

module.exports = {
  add: async (ctx) => {
    try {
      const levelSchema = await services.add(ctx.request.body);
      ctx.body = { ok: true, levelSchema };
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
  setParent: async (ctx) => {
    try {
      const levelSchema = await services.setParent(ctx.request.params.id, ctx.request.body.parent);
      ctx.body = { ok: true, levelSchema };
    } catch (e) {
      ctx.body = { ok: false, error: e.message };
    }
  },
  setIsClass: async (ctx) => {
    try {
      const levelSchema = await services.setIsClass(
        ctx.request.params.id,
        ctx.request.body.isClass
      );
      ctx.body = { ok: true, levelSchema };
    } catch (e) {
      ctx.body = { ok: false, error: e.message };
    }
  },
  addAssignables: async (ctx) => {
    try {
      const assignables = await services.addAssignables(
        ctx.request.params.id,
        ctx.request.body.profiles
      );
      ctx.body = { ok: true, assignables };
    } catch (e) {
      ctx.body = { ok: false, error: e.message };
    }
  },
  removeAssignables: async (ctx) => {
    try {
      const assignables = await services.removeAssignables(
        ctx.request.params.id,
        ctx.request.body.profiles
      );
      ctx.body = { ok: true, assignables };
    } catch (e) {
      ctx.body = { ok: false, error: e.message };
    }
  },
};
