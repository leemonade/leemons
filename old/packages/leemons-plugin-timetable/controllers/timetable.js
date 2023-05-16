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
    const { start, end, startBetween, endBetween, days } = ctx.request.query;
    try {
      const count = await leemons.plugin.services.timetable.count(classId, {
        start,
        end,
        // Parse the arrays as JSONs (for the query). To use it, provide the times as strings.
        startBetween: startBetween ? JSON.parse(startBetween) : undefined,
        endBetween: endBetween ? JSON.parse(endBetween) : undefined,
        days: days ? JSON.parse(days) : undefined,
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

  update: async (ctx) => {
    const { id: timetableId } = ctx.request.params;
    const { day, start, duration } = ctx.request.body;
    try {
      const timetable = await leemons.plugin.services.timetable.update(timetableId, {
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

  delete: async (ctx) => {
    const { id: timetableId } = ctx.request.params;
    try {
      const deleted = await leemons.plugin.services.timetable.delete(timetableId);
      ctx.body = {
        status: 200,
        deleted,
      };
    } catch (error) {
      // Should never throw, so if it occurs, it's an Internal Server Error
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  },
};
