const services = leemons.plugin.services.assignableInstances;

module.exports = {
  get: async (ctx) => {
    const { id } = ctx.params;
    const { details } = ctx.query;

    try {
      const assignableInstance = await services.getAssignableInstance(id, {
        details: details === 'true',
        userSession: ctx.state.userSession,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        assignableInstance,
      };
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: e.message,
      };
    }
  },
  search: async (ctx) => {
    try {
      const { query } = ctx.request;

      if (query.classes) {
        query.classes = JSON.parse(query.classes);
      }

      const assignableInstances = await services.searchAssignableInstances(query, {
        userSession: ctx.state.userSession,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        assignableInstances,
      };
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: e.message,
      };
    }
  },
};
