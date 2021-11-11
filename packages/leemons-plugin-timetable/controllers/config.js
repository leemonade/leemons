module.exports = {
  create: async (ctx) => {
    const { type, id } = ctx.request.params;
    const { start, end, days, breaks, slot } = ctx.request.body;
    try {
      const config = await leemons.plugin.services.config.create({
        entity: id,
        entityType: type,
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
    const { type, id } = ctx.request.params;
    try {
      const config = await leemons.plugin.services.config.get(id, type);
      ctx.status = 200;
      ctx.body = {
        status: 200,
        config,
      };
    } catch (e) {
      // Should never throw, so if it occurs, it's an Internal Server Error
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  },
  has: async (ctx) => {
    const { type, id } = ctx.request.params;
    try {
      const exists = await leemons.plugin.services.config.has(id, type);
      ctx.status = 200;
      ctx.body = {
        status: 200,
        exists,
      };
    } catch (e) {
      // Should never throw, so if it occurs, it's an Internal Server Error
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  },

  update: async (ctx) => {
    const { type, id } = ctx.request.params;
    const { start, end, days, breaks, slot } = ctx.request.body;
    try {
      const config = await leemons.plugin.services.config.update({
        entity: id,
        entityType: type,
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
    const { type, id } = ctx.request.params;
    try {
      const deleted = await leemons.plugin.services.config.delete(id, type);
      ctx.status = 200;
      ctx.body = {
        status: 200,
        deleted,
      };
    } catch (e) {
      // Should never throw, so if it occurs, it's an Internal Server Error
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  },
};
