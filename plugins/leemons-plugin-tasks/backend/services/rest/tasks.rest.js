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
  // eslint-disable-next-line prefer-const
  let { task, ...otherProperties } = ctx.params;

  task = JSON.parse(task);

  _.forIn(otherProperties, (value, key) => {
    _.set(task, key, value);
  });
  return task;
}

const createRest = require('./openapi/tasks/createRest');
const updateRest = require('./openapi/tasks/updateRest');
const getRest = require('./openapi/tasks/getRest');
const duplicateRest = require('./openapi/tasks/duplicateRest');
const removeRest = require('./openapi/tasks/removeRest');
const publishRest = require('./openapi/tasks/publishRest');
const searchRest = require('./openapi/tasks/searchRest');
/** @type {ServiceSchema} */
module.exports = {
  createRest: {
    openapi: createRest.openapi,
    rest: {
      method: 'POST',
      path: '/',
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
    openapi: updateRest.openapi,
    rest: {
      method: 'PUT',
      path: '/:id',
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
    openapi: getRest.openapi,
    rest: {
      method: 'GET',
      path: '/:id',
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
    openapi: duplicateRest.openapi,
    rest: {
      method: 'POST',
      path: '/:id/duplicate',
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
    openapi: removeRest.openapi,
    rest: {
      method: 'DELETE',
      path: '/:id',
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
    openapi: publishRest.openapi,
    rest: {
      method: 'POST',
      path: '/:id/publish',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      try {
        const { id: taskId } = ctx.params;

        const published = await publish({ taskId, ctx });

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
    openapi: searchRest.openapi,
    rest: {
      method: 'GET',
      path: '/search',
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
