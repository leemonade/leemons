/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');

const { updateStudent } = require('../../core/assignments/updateStudent');

/** @type {ServiceSchema} */
module.exports = {
  instanceCreateRest: {
    rest: {
      method: 'POST',
      path: '/tasks/:task/assignments/instance',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      try {
        const { task, ...instanceData } = ctx.params;

        const instance = await ctx.tx.call(
          'assignables.assignableInstances.createAssignableInstance',
          {
            assignableInstance: {
              assignable: task.id,
              ...instanceData,
            },
          }
        );

        return {
          status: 201,
          instance,
        };
      } catch (e) {
        ctx.meta.$statusCode = 400;
        return {
          status: 400,
          message: e.message,
        };
      }
    },
  },
  instanceGetRest: {
    rest: {
      method: 'PUT',
      path: '/tasks/assignments/instance/:instance',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      try {
        const { instance } = ctx.request.params;

        const data = await ctx.tx.call('assignables.instances.getAssignableInstance', {
          ids: instance,
        });

        return {
          status: 200,
          data,
        };
      } catch (e) {
        ctx.meta.$statusCode = 400;
        return {
          status: 400,
          message: e.message,
        };
      }
    },
  },
  studentUpdateRest: {
    rest: {
      method: 'PUT',
      path: '/tasks/instances/:instance/students/:student',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      try {
        const { instance, student, ...body } = ctx.params;

        const updated = await updateStudent({ instance, student, ...body, ctx });

        return {
          status: 200,
          updated,
        };
      } catch (e) {
        ctx.meta.$statusCode = 400;
        return {
          status: 400,
          message: e.message,
        };
      }
    },
  },
};
