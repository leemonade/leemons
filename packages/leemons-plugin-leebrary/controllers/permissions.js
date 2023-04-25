const { set } = require('../src/services/permissions/set');

module.exports = {
  set: async (ctx) => {
    const { asset } = ctx.params;
    const { userSession } = ctx.state;

    const permissions = await set(asset, ctx.request.body, { userSession });

    ctx.status = 200;
    ctx.body = {
      status: 200,
      permissions,
    };
  },
};
