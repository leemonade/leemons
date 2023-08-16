const _ = require('lodash');
const create = require('../src/services/task/create');
const duplicate = require('../src/services/task/duplicate');
const { get } = require('../src/services/task/get');
const publish = require('../src/services/task/publish');
const remove = require('../src/services/task/remove');
const search = require('../src/services/task/search');
const update = require('../src/services/task/update');

function parseTaskObject(ctx) {
  const { body, files } = ctx.request;

  // eslint-disable-next-line prefer-const
  let { task, ...otherProperties } = body;

  task = JSON.parse(task);

  _.forIn(files, (file, key) => {
    _.set(task, key, file);
  });

  _.forIn(otherProperties, (value, key) => {
    _.set(task, key, value);
  });
  return task;
}

module.exports = {
  create: async (ctx) => {
    try {
      let task = parseTaskObject(ctx);

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
      let task = parseTaskObject(ctx);

      task = await update(id, task, { userSession: ctx.state.userSession });

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
        withFiles: true,
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
  duplicate: async (ctx) => {
    try {
      const { id } = ctx.params;
      const { published } = ctx.request.body;
      const task = await duplicate(id, { published, userSession: ctx.state.userSession });

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

      const published = await publish(id, { userSession: ctx.state.userSession });

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
      const { offset, size, draft, preferCurrent, ...query } = ctx.request.query;

      const tasks = await search({
        // offset: parseInt(offset, 10) || 0,
        // size: parseInt(size, 10) || 10,
        draft: draft === 'true',
        preferCurrent: preferCurrent === 'true',
        ...query,
        userSession: ctx.state.userSession,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        tasks,
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
