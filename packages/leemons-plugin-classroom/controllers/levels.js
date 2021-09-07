const services = leemons.plugin.services.levels;

module.exports = {
  add: async (ctx) => {
    try {
      const level = await services.add(ctx.request.body);
      ctx.status = 201;
      ctx.body = { status: 201, level };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  get: async (ctx) => {
    try {
      const levelSchema = await services.get(ctx.params.id, { locale: ctx.request.query.locale });
      ctx.status = 200;
      ctx.body = { status: 200, levelSchema };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  list: async (ctx) => {
    try {
      const items = await services.list({ locale: ctx.request.query.locale });
      ctx.status = 200;
      ctx.body = { status: 200, items };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  delete: async (ctx) => {
    try {
      await services.delete(ctx.params.id);
      ctx.status = 200;
      ctx.body = { status: 200, deleted: true };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  setNames: async (ctx) => {
    try {
      const names = await services.setNames(ctx.request.params.id, ctx.request.body.names);
      ctx.status = 201;
      ctx.body = { status: 201, ok: true, names };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  setDescriptions: async (ctx) => {
    try {
      const names = await services.setDescriptions(
        ctx.request.params.id,
        ctx.request.body.descriptions
      );
      ctx.status = 201;
      ctx.body = { status: 201, names };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  setParent: async (ctx) => {
    try {
      const levelSchema = await services.setParent(ctx.request.params.id, ctx.request.body.parent);
      ctx.status = 200;
      ctx.body = { status: 200, levelSchema };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },

  getUsers: async (ctx) => {
    try {
      const users = await services.getUsers(ctx.request.params.id, {
        roles: ctx.request.body?.roles,
      });

      ctx.status = 200;
      ctx.body = { status: 200, users };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  addUsers: async (ctx) => {
    try {
      const users = await services.addUsers({
        users: ctx.request.body.users,
        level: ctx.request.params.id,
        role: ctx.request.body.role,
      });

      ctx.status = 201;
      ctx.body = { status: 201, users };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
  removeUsers: async (ctx) => {
    try {
      const count = await services.removeUsers({
        users: ctx.request.body.users,
        level: ctx.request.params.id,
      });

      ctx.status = 200;
      ctx.body = { status: 200, count };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  },
};
