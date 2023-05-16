const services = leemons.plugin.services.assignableInstances;

module.exports = {
  get: async (ctx) => {
    const { id } = ctx.params;
    const { details, ids, throwOnMissing, relatedInstances } = ctx.query;

    if (id) {
      try {
        const assignableInstance = await services.getAssignableInstance(id, {
          details: details === 'true',
          userSession: ctx.state.userSession,
        });

        ctx.status = 200;
        ctx.body = {
          status: 200,
          assignableInstance,
        };
      } catch (e) {
        ctx.status = 500;
        ctx.body = {
          status: 500,
          message: e.message,
        };
      }
    } else {
      try {
        const instances = await services.getAssignableInstances(Array.isArray(ids) ? ids : [ids], {
          details: details === 'true',
          throwOnMissing: throwOnMissing === 'true',
          relatedAssignableInstances: relatedInstances === 'true',
          userSession: ctx.state.userSession,
        });

        ctx.status = 200;
        ctx.body = {
          status: 200,
          instances,
        };
      } catch (e) {
        ctx.status = 500;
        ctx.body = {
          status: 500,
          message: e.message,
        };
      }
    }
  },
  update: async (ctx) => {
    const { id } = ctx.request.params;
    const { dates } = ctx.request.body;

    try {
      const updatedAssignableInstance = await services.updateAssignableInstance(
        {
          id,
          dates,
        },
        { userSession: ctx.state.userSession }
      );

      ctx.status = 200;
      ctx.body = {
        status: 200,
        assignableInstance: updatedAssignableInstance,
      };
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: e.message,
      };
    }
  },
  search: async (ctx) => {
    try {
      const { query } = ctx.request;

      if (query.classes) {
        query.classes = JSON.parse(query.classes);
      }

      if (query.subjects) {
        query.subjects = JSON.parse(query.subjects);
      }

      if (query.closed === 'true') {
        query.closed = true;
      } else if (query.closed === 'false') {
        query.closed = false;
      }

      if (query.evaluated === 'true') {
        query.evaluated = true;
      } else if (query.evaluated === 'false') {
        query.evaluated = false;
      }

      if (query.archived === 'true') {
        query.archived = true;
      } else if (query.archived === 'false') {
        query.archived = false;
      }

      const assignableInstances = await services.searchAssignableInstances(query, {
        userSession: ctx.state.userSession,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        assignableInstances,
      };
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        status: 500,
        message: e.message,
      };
    }
  },
  sendReminder: async (ctx) => {
    try {
      const { body } = ctx.request;

      await services.sendReminder(body, {
        userSession: ctx.state.userSession,
        ctx,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
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
