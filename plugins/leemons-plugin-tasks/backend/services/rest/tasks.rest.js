/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const _ = require('lodash');

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const create = require('../../core/task/create');
const update = require('../../core/task/update');
const { get } = require('../../core/task/get');
const duplicate = require('../../core/task/duplicate');
const remove = require('../../core/task/remove');
const publish = require('../../core/task/publish');
const search = require('../../core/task/search');

function parseTaskObject(ctx) {
  const { body, files } = ctx.params;

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

/** @type {ServiceSchema} */
module.exports = {
  createRest: {
    rest: {
      method: 'POST',
      path: '/tasks',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      try {
        let task = parseTaskObject(ctx);

        task = await create({ ...task, ctx });

        return {
          status: 201,
          task,
        };
      } catch (error) {
        ctx.logger.error(error.message);
        ctx.meta.$statusCode = 400;
        return { status: 400, error: error.message };
      }
    },
  },
  updateRest: {
    rest: {
      method: 'PUT',
      path: '/tasks/:id',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      try {
        const { id: taskId } = ctx.params;
        let task = parseTaskObject(ctx);
        task = await update({ ...task, taskId, ctx });
        return {
          status: 200,
          task,
        };
      } catch (error) {
        ctx.meta.$statusCode = 400;
        return { status: 400, error: error.message };
      }
    },
  },
  getRest: {
    rest: {
      method: 'GET',
      path: '/tasks/:id',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      try {
        const { id: taskId } = ctx.params;
        let { columns } = ctx.params;
        try {
          columns = JSON.parse(columns);
        } catch (e) {
          if (columns !== '*') {
            columns = undefined;
          }
        }
        const task = await get({
          taskId,
          columns,
          withFiles: true,
          ctx,
        });

        return {
          status: 200,
          task,
        };
      } catch (error) {
        ctx.meta.$statusCode = 400;
        return { status: 400, error: error.message };
      }
    },
  },
  duplicateRest: {
    rest: {
      method: 'POST',
      path: '/tasks/:id/duplicate',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      try {
        const { id: taskId, published } = ctx.params;
        const task = await duplicate({ taskId, published, ctx });
        return {
          status: 201,
          task,
        };
      } catch (error) {
        ctx.meta.$statusCode = 400;
        return {
          status: 400,
          error: error.message,
        };
      }
    },
  },
  removeRest: {
    rest: {
      method: 'DELETE',
      path: '/tasks/:id',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      try {
        const { id: taskId } = ctx.params;

        const deleted = await remove({ taskId, ctx });

        return {
          status: 200,
          ...deleted,
        };
      } catch (error) {
        ctx.meta.$statusCode = 400;
        return {
          status: 400,
          error: error.message,
        };
      }
    },
  },
  publishRest: {
    rest: {
      method: 'POST',
      path: '/tasks/:id/publish',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      try {
        const { id: taskId } = ctx.params;

        const published = await publish({ taskId, userSession: ctx.state.userSession });

        return {
          status: 200,
          published,
        };
      } catch (e) {
        ctx.meta.$statusCode = 400;
        return {
          status: 400,
          error: e.message,
        };
      }
    },
  },
  searchRest: {
    rest: {
      method: 'GET',
      path: '/tasks/search',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      try {
        const { offset, size, draft, preferCurrent, ...query } = ctx.params;

        const tasks = await search({
          // offset: parseInt(offset, 10) || 0,
          // size: parseInt(size, 10) || 10,
          draft: draft === 'true',
          preferCurrent: preferCurrent === 'true',
          ...query,
          ctx,
        });

        return {
          status: 200,
          tasks,
        };
      } catch (e) {
        ctx.meta.$statusCode = 400;
        return {
          status: 400,
          error: e.message,
        };
      }
    },
  },
};
