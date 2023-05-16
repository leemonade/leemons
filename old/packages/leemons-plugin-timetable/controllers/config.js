module.exports = {
  create: async (ctx) => {
    const { entities, start, end, days, breaks, slot } = ctx.request.body;
    try {
      const config = await leemons.plugin.services.config.create({
        entities,
        start,
        end,
        days,
        breaks,
        slot,
      });
      ctx.status = 200;
      ctx.body = {
        status: 200,
        config,
      };
    } catch (e) {
      // The most frequent error is that the params are invalid
      ctx.status = 401;
      ctx.body = {
        status: 401,
        message: e.message,
      };
    }
  },
  get: async (ctx) => {
    const { entities } = ctx.request.query;
    try {
      const config = await leemons.plugin.services.config.get(JSON.parse(entities));
      ctx.status = 200;
      ctx.body = {
        status: 200,
        config,
      };
    } catch (e) {
      ctx.status = 401;
      ctx.body = {
        status: 401,
        message: e.message,
      };
    }
  },
  has: async (ctx) => {
    const { entities } = ctx.request.query;

    try {
      const exists = await leemons.plugin.services.config.has(JSON.parse(entities));
      ctx.status = 200;
      ctx.body = {
        status: 200,
        exists,
      };
    } catch (e) {
      ctx.status = 401;
      ctx.body = {
        status: 401,
        message: e.message,
      };
    }
  },

  update: async (ctx) => {
    const { entities, start, end, days, breaks, slot } = ctx.request.body;
    try {
      const config = await leemons.plugin.services.config.update({
        entities,
        start,
        end,
        days,
        breaks,
        slot,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        config,
      };
    } catch (e) {
      // The most frequent error is that the params are invalid
      ctx.status = 401;
      ctx.body = {
        status: 401,
        message: e.message,
      };
    }
  },

  delete: async (ctx) => {
    const { entities } = ctx.request.query;

    try {
      const deleted = await leemons.plugin.services.config.delete(JSON.parse(entities));
      ctx.status = 200;
      ctx.body = {
        status: 200,
        deleted,
      };
    } catch (e) {
      ctx.status = 401;
      ctx.body = {
        status: 401,
        message: e.message,
      };
    }
  },
};
