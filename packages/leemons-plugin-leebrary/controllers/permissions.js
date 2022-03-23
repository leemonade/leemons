const { set } = require('../src/services/permissions/set');
/*
const get = require('../src/services/permissions/get');
const has = require('../src/services/permissions/has');
const list = require('../src/services/permissions/list');
const remove = require('../src/services/permissions/remove');

module.exports = {
  remove: async (ctx) => {
    const { asset } = ctx.params;
    const { userAgent } = ctx.request.query;
    const { userSession } = ctx.state;

    try {
      const deleted = await remove(asset, userAgent, { userSession });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        deleted,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  get: async (ctx) => {
    const { asset } = ctx.params;
    const { userSession } = ctx.state;

    try {
      const permissions = await get(asset, { userSession });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        permissions,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  has: async (ctx) => {
    const { asset } = ctx.params;
    const { permissions } = ctx.request.query;
    const { userSession } = ctx.state;

    try {
      const hasPermissions = await has(asset, JSON.parse(permissions), { userSession });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        has: hasPermissions,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  list: async (ctx) => {
    const { asset } = ctx.params;
    const { userSession } = ctx.state;

    try {
      const users = await list(asset, { userSession });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        users,
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
*/
module.exports = {
  set: async (ctx) => {
    const { asset } = ctx.params;
    const { userAgentsAndRoles } = ctx.request.body;
    const { userSession } = ctx.state;

    const permissions = await set(asset, userAgentsAndRoles, { userSession });

    ctx.status = 200;
    ctx.body = {
      status: 200,
      permissions,
    };
  },
};
