/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');

const { updateStudent } = require('../../core/assignments/updateStudent');

const instanceCreateRest = require('./openapi/assignments/instanceCreateRest');
const instanceGetRest = require('./openapi/assignments/instanceGetRest');
const studentUpdateRest = require('./openapi/assignments/studentUpdateRest');
/** @type {ServiceSchema} */
module.exports = {
  instanceCreateRest: {
    openapi: instanceCreateRest.openapi,
    rest: {
      method: 'POST',
      path: '/:task/instance',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      try {
        const { task, ...instanceData } = ctx.params;

        const instance = await ctx.tx.call(
          'assignables.assignableInstances.createAssignableInstance',
          {
            assignableInstance: {
              assignable: task,
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
    openapi: instanceGetRest.openapi,
    rest: {
      method: 'PUT',
      path: '/instance/:instance',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      try {
        const { instance } = ctx.request.params;

        const data = await ctx.tx.call(
          'assignables.instances.getAssignableInstance',
          {
            ids: instance,
          }
        );

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
    openapi: studentUpdateRest.openapi,
    rest: {
      method: 'PUT',
      path: '/instance/:instance/student/:student',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      try {
        const { instance, student, ...body } = ctx.params;

        const updated = await updateStudent({
          instance,
          student,
          ...body,
          ctx,
        });

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
