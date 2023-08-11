const {
  assignModule,
  createModule,
  updateModule,
  duplicateModule,
  removeModule,
  publishModule,
} = require('../src/services/modules');

module.exports = {
  assign: async (ctx) => {
    const { id } = ctx.request.params;
    const { activities, assignationForm } = ctx.request.body;

    try {
      const assignation = await assignModule(
        {
          moduleId: id,
          config: { activities, assignationForm },
        },
        { userSession: ctx.state.userSession, ctx }
      );

      ctx.status = 201;
      ctx.body = { status: 201, assignation };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  create: async (ctx) => {
    const { published, ...module } = ctx.request.body;

    try {
      const createdModule = await createModule(module, {
        published: !!published,
        userSession: ctx.state.userSession,
      });

      ctx.status = 201;
      ctx.body = {
        status: 201,
        module: createdModule,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  update: async (ctx) => {
    const { id } = ctx.request.params;
    const { published, ...module } = ctx.request.body;

    try {
      const updatedModule = await updateModule(id, module, {
        published,
        userSession: ctx.state.userSession,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        module: updatedModule,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  duplicate: async (ctx) => {
    const { id } = ctx.request.params;
    const { published } = ctx.request.query;

    try {
      const duplicatedModule = await duplicateModule(id, {
        published: published === 'true',
        userSession: ctx.state.userSession,
      });

      ctx.status = 201;
      ctx.body = {
        status: 201,
        module: duplicatedModule,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  remove: async (ctx) => {
    const { id } = ctx.request.params;

    try {
      const deleted = await removeModule(id, {
        userSession: ctx.state.userSession,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        ...deleted,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  publish: async (ctx) => {
    const { id } = ctx.request.params;

    try {
      const published = await publishModule(id, {
        userSession: ctx.state.userSession,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        published,
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
