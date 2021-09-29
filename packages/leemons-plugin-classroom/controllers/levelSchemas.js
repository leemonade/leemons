const services = leemons.plugin.services.levelSchemas;

module.exports = {
  add: async (ctx) => {
    try {
      const levelSchema = await services.add(ctx.request.body, {
        userSession: ctx.state.userSession,
      });
      ctx.status = 201;
      ctx.body = { status: 201, levelSchema };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  get: async (ctx) => {
    try {
      const levelSchema = await services.get(ctx.params.id, {
        locale: ctx.request.query.locale,
        userSession: ctx.state.userSession,
      });
      ctx.status = 200;
      ctx.body = { status: 200, levelSchema };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  getNames: async (ctx) => {
    try {
      const levelSchema = await services.getNames(ctx.params.id, {
        userSession: ctx.state.userSession,
      });
      ctx.status = 200;
      ctx.body = { status: 200, levelSchema };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  list: async (ctx) => {
    try {
      const items = await services.list({
        locale: ctx.request.query.locale,
        userSession: ctx.state.userSession,
      });
      ctx.status = 200;
      ctx.body = { status: 200, items };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  delete: async (ctx) => {
    try {
      await services.delete(ctx.params.id, {
        userSession: ctx.state.userSession,
      });
      ctx.status = 200;
      ctx.body = { status: 200, deleted: true };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  update: async (ctx) => {
    try {
      const levelSchema = await services.update(ctx.params.id, {
        userSession: ctx.state.userSession,
        ...ctx.request.body,
      });
      ctx.status = 200;
      ctx.body = { status: 200, levelSchema };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  setNames: async (ctx) => {
    try {
      const names = await services.setNames(ctx.request.params.id, ctx.request.body.names, {
        userSession: ctx.state.userSession,
      });
      ctx.status = 201;
      ctx.body = { status: 201, ok: true, names };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  setParent: async (ctx) => {
    try {
      const levelSchema = await services.setParent(ctx.request.params.id, ctx.request.body.parent, {
        userSession: ctx.state.userSession,
      });
      ctx.status = 200;
      ctx.body = { status: 200, levelSchema };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  setIsClass: async (ctx) => {
    try {
      const levelSchema = await services.setIsClass(
        ctx.request.params.id,
        ctx.request.body.isClass,
        { userSession: ctx.state.userSession }
      );
      ctx.status = 200;
      ctx.body = { status: 200, levelSchema };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  addAssignables: async (ctx) => {
    try {
      const assignables = await services.addAssignables(
        ctx.request.params.id,
        ctx.request.body.profiles,
        { userSession: ctx.state.userSession }
      );
      ctx.status = 201;
      ctx.body = { status: 201, assignables };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  removeAssignables: async (ctx) => {
    try {
      const assignables = await services.removeAssignables(
        ctx.request.params.id,
        ctx.request.body.profiles,
        { userSession: ctx.state.userSession }
      );
      ctx.status = 200;
      ctx.body = { status: 200, assignables };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
};
