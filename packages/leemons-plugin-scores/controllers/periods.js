const addPeriod = require('../src/services/periods/addPeriod');
const listPeriods = require('../src/services/periods/listPeriods');

module.exports = {
  add: async (ctx) => {
    const { period } = ctx.request.body;
    const { userSession } = ctx.state;

    try {
      const savedPeriod = await addPeriod(period, {
        userSession,
      });

      ctx.status = 201;
      ctx.body = {
        status: 201,
        period: savedPeriod,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: e.message,
      };
    }
  },
  list: async (ctx) => {
    const { query } = ctx.request;
    const { userSession } = ctx.state;

    try {
      const periods = await listPeriods(query, {
        userSession,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        data: periods,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: e.message,
      };
    }
  },
};
