module.exports = {
  create: async (ctx) => {
    const { class: classId, day, start, duration } = ctx.request.body;
    try {
      const timetable = await leemons.plugin.services.timetable.create({
        class: classId,
        day,
        start,
        duration,
      });
      ctx.body = {
        timetable,
        status: 200,
      };
    } catch (error) {
      ctx.body = {
        error: error.message,
        status: 400,
      };
    }
  },

  get: async (ctx) => {
    const { id: classId } = ctx.request.params;
    const { start, end, startBetween, endBetween } = ctx.request.query;
    try {
      const timetable = await leemons.plugin.services.timetable.get(classId, {
        start,
        end,
        // Parse the arrays as JSONs (for the query). To use it, provide the times as strings.
        startBetween: startBetween ? JSON.parse(startBetween) : undefined,
        endBetween: endBetween ? JSON.parse(endBetween) : undefined,
      });
      ctx.body = {
        timetable,
        status: 200,
      };
    } catch (error) {
      ctx.body = {
        error: error.message,
        status: 400,
      };
    }
  },

  count: async (ctx) => {
    const { id: classId } = ctx.request.params;
    const { start, end, startBetween, endBetween } = ctx.request.query;
    try {
      const count = await leemons.plugin.services.timetable.count(classId, {
        start,
        end,
        // Parse the arrays as JSONs (for the query). To use it, provide the times as strings.
        startBetween: startBetween ? JSON.parse(startBetween) : undefined,
        endBetween: endBetween ? JSON.parse(endBetween) : undefined,
      });
      ctx.body = {
        count,
        status: 200,
      };
    } catch (error) {
      ctx.body = {
        error: error.message,
        status: 400,
      };
    }
  },
};
