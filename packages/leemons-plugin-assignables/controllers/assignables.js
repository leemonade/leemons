const getAssignables = require('../src/services/assignable/getAssignables');

module.exports = {
  get: async (ctx) => {
    const { ids, withFiles, deleted } = ctx.query;

    const idsToUse = Array.isArray(ids) ? ids : [ids];

    try {
      const assignables = await getAssignables(idsToUse, {
        withFiles: withFiles === 'true',
        deleted: deleted === 'true',
        userSession: ctx.state.userSession,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        assignables,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
};
