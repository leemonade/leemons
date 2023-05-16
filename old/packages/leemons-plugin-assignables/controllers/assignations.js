const services = leemons.plugin.services.assignations;

module.exports = {
  get: async (ctx) => {
    try {
      const { instance, user } = ctx.params;

      const assignations = await services.getAssignation(instance, user, {
        userSession: ctx.state.userSession,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        assignations,
      };
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        error: e.message,
      };
    }
  },
  getMany: async (ctx) => {
    try {
      const { queries, details, throwOnMissing, fetchInstance } = ctx.query;

      const parsedQueries = (Array.isArray(queries) ? queries : [queries]).map(JSON.parse);

      const assignations = await services.getAssignations(parsedQueries, {
        details: details === 'true',
        throwOnMissing: throwOnMissing === 'true',
        fetchInstance: fetchInstance === 'true',
        userSession: ctx.state.userSession,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        assignations,
      };
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        error: e.message,
      };
    }
  },
};
