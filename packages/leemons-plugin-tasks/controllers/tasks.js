const create = require('../src/services/task/create');
const { get } = require('../src/services/task/get');
const publish = require('../src/services/task/versions/publish');
const remove = require('../src/services/task/remove');
const search = require('../src/services/task/search');
const update = require('../src/services/task/update');

module.exports = {
  create: async (ctx) => {
    try {
      let task = ctx.request.body;

      task = await create(task, { userSession: ctx.state.userSession });

      ctx.status = 201;
      ctx.body = {
        status: 201,
        task,
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: error.message,
      };
    }
  },
  update: async (ctx) => {
    try {
      const { id } = ctx.params;
      const {
        name,
        tagline,
        level,
        summary,
        cover,
        color,
        methodology,
        recommendedDuration,
        statement,
        development,
        submissions,
        preTask,
        preTaskOptions,
        selfReflection,
        feedback,
        instructionsForTeacher,
        instructionsForStudent,
        state,
        published,
        subjects,
        center,
        program,
        tags,
        attachments,
      } = ctx.request.body;

      let task = {
        name,
        tagline,
        level,
        summary,
        cover,
        color,
        methodology,
        recommendedDuration,
        statement,
        development,
        submissions,
        preTask,
        preTaskOptions,
        selfReflection,
        feedback,
        instructionsForTeacher,
        instructionsForStudent,
        state,
        published,
        subjects,
        center,
        program,
        tags,
        attachments,
      };

      task = await update(id, task);

      ctx.status = 200;
      ctx.body = {
        status: 200,
        task,
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: error.message,
      };
    }
  },
  get: async (ctx) => {
    try {
      const { id } = ctx.params;
      let { columns } = ctx.query;
      try {
        columns = JSON.parse(columns);
      } catch (e) {
        if (columns !== '*') {
          columns = undefined;
        }
      }
      const task = await get(id, {
        userSession: ctx.state.userSession,
        columns,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        task,
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: error.message,
      };
    }
  },
  remove: async (ctx) => {
    try {
      const { id } = ctx.params;

      const deleted = await remove(id, { userSession: ctx.state.userSession });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        ...deleted,
      };
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: error.message,
      };
    }
  },
  publish: async (ctx) => {
    try {
      const { id } = ctx.params;

      const published = await publish(id);

      ctx.status = 200;
      ctx.body = {
        status: 200,
        published,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        error: e.message,
      };
    }
  },
  search: async (ctx) => {
    try {
      const { offset, size, draft, ...query } = ctx.request.query;

      const tasks = await search(
        { ...query },
        parseInt(offset, 10) || 0,
        parseInt(size, 10) || 10,
        {
          draft: draft === 'true',
        }
      );

      ctx.status = 200;
      ctx.body = {
        status: 200,
        ...tasks,
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
