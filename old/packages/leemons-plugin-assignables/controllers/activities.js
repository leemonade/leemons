const searchNyaActivities = require('../src/services/ongoing/searchNyaActivities');
const searchOngoingActivities = require('../src/services/ongoing/searchOngoingActivities');

module.exports = {
  searchOngoing: async (ctx) => {
    const { query } = ctx;
    const { userSession } = ctx.state;

    try {
      const activities = await searchOngoingActivities(query, { userSession });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        activities,
      };
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: e.message,
      };
    }
  },
  searchNyaActivities: async (ctx) => {
    const { query } = ctx;
    const { userSession } = ctx.state;

    try {
      const activities = await searchNyaActivities(query, { userSession });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        activities,
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
