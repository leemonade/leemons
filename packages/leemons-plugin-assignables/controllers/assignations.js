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
};
