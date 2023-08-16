const addPeriod = require('../src/services/periods/addPeriod');
const listPeriods = require('../src/services/periods/listPeriods');
const removePeriod = require('../src/services/periods/removePeriod');

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

    const q = Object.fromEntries(
      Object.entries(query).map(([key, value]) => {
        try {
          const jsonValue = JSON.parse(value);

          return [key, jsonValue];
        } catch (e) {
          return [key, value];
        }
      })
    );

    try {
      const periods = await listPeriods(q, {
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
  remove: async (ctx) => {
    const { id } = ctx.request.params;
    const { userSession } = ctx.state;

    try {
      const period = await removePeriod(parseInt(id, 10), {
        userSession,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        data: period,
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
