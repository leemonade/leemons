/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsValidator } = require('@leemons/validator');
const _ = require('lodash');

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const {
  list,
  details,
  deleteTest,
  save,
  getAssignSavedConfigs,
  updateAssignSavedConfig,
  deleteAssignSavedConfig,
  assign,
  duplicate,
  getFeedback,
  setFeedback,
  setInstanceTimestamp,
  setQuestionResponse,
  getUserQuestionResponses,
} = require('../../core/tests');

const listTestsRest = require('./openapi/tests/listTestsRest');
const getTestRest = require('./openapi/tests/getTestRest');
const deleteTestRest = require('./openapi/tests/deleteTestRest');
const saveTestRest = require('./openapi/tests/saveTestRest');
const getAssignConfigsRest = require('./openapi/tests/getAssignConfigsRest');
const updateAssignConfigRest = require('./openapi/tests/updateAssignConfigRest');
const deleteAssignConfigRest = require('./openapi/tests/deleteAssignConfigRest');
const assignTestRest = require('./openapi/tests/assignTestRest');
const duplicateRest = require('./openapi/tests/duplicateRest');
const getInstanceFeedbackRest = require('./openapi/tests/getInstanceFeedbackRest');
const setInstanceFeedbackRest = require('./openapi/tests/setInstanceFeedbackRest');
const setInstanceTimestampRest = require('./openapi/tests/setInstanceTimestampRest');
const setQuestionResponseRest = require('./openapi/tests/setQuestionResponseRest');
const getUserQuestionResponsesRest = require('./openapi/tests/getUserQuestionResponsesRest');
/** @type {ServiceSchema} */
module.exports = {
  listTestsRest: {
    openapi: listTestsRest.openapi,
    rest: {
      method: 'GET',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'tests.tests': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          page: { type: ['number', 'string'] },
          size: { type: ['number', 'string'] },
          published: { type: ['boolean', 'string'] },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const { page, size, ...options } = ctx.params;
        if (options.published === 'true') {
          options.published = true;
        } else if (options.published === 'false') {
          options.published = false;
        }
        const data = await list({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          ...options,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  getTestRest: {
    openapi: getTestRest.openapi,
    rest: {
      method: 'GET',
      path: '/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'tests.tests': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const [test] = await details({
        id: ctx.params.id,
        withQuestionBank: _.isBoolean(ctx.params.withQuestionBank)
          ? ctx.params.withQuestionBank
          : ctx.params.withQuestionBank === 'true',
        ctx,
      });
      return { status: 200, test };
    },
  },
  deleteTestRest: {
    openapi: deleteTestRest.openapi,
    rest: {
      method: 'DELETE',
      path: '/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'tests.tests': {
            actions: ['admin', 'delete'],
          },
        },
      }),
    ],
    async handler(ctx) {
      await deleteTest({
        id: ctx.params.id,
        ctx,
      });
      return { status: 200, deleted: true };
    },
  },
  saveTestRest: {
    openapi: saveTestRest.openapi,
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'tests.tests': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      // Solución temporal, desde el frontend llega levels. Arroja un error de validación en la primera línea de save()
      const data = { ...ctx.params, level: ctx.params.levels || null };
      delete data.levels;
      const test = await save({
        data,
        ctx,
      });
      return { status: 200, test };
    },
  },
  getAssignConfigsRest: {
    openapi: getAssignConfigsRest.openapi,
    rest: {
      method: 'GET',
      path: '/assign/configs',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'tests.tests': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const configs = await getAssignSavedConfigs({
        ctx,
      });
      return { status: 200, configs };
    },
  },
  updateAssignConfigRest: {
    openapi: updateAssignConfigRest.openapi,
    rest: {
      method: 'PUT',
      path: '/assign/configs/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'tests.tests': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { name, config, id } = ctx.params;

      await updateAssignSavedConfig({
        name,
        config,
        id,
        ctx,
      });

      return { status: 200, updated: true };
    },
  },
  deleteAssignConfigRest: {
    openapi: deleteAssignConfigRest.openapi,
    rest: {
      method: 'DELETE',
      path: '/assign/configs/:id',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'tests.tests': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { id } = ctx.params;

      await deleteAssignSavedConfig({
        id,
        ctx,
      });

      return { status: 200, deleted: true };
    },
  },
  assignTestRest: {
    openapi: assignTestRest.openapi,
    rest: {
      method: 'POST',
      path: '/assign',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'tests.tests': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const test = await assign({
        ...ctx.params,
        ctx,
      });
      return { status: 200, test };
    },
  },
  duplicateRest: {
    openapi: duplicateRest.openapi,
    rest: {
      method: 'POST',
      path: '/duplicate',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'tests.tests': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const test = await duplicate({
        taskId: ctx.params.id,
        published: ctx.params.published,
        ignoreSubjects: ctx.params.ignoreSubjects,
        keepQuestionBank: ctx.params.keepQuestionBank,
        ctx,
      });
      return { status: 200, test };
    },
  },
  getInstanceFeedbackRest: {
    openapi: getInstanceFeedbackRest.openapi,
    rest: {
      method: 'GET',
      path: '/instance/:id/feedback/:user',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const feedback = await getFeedback({
        instanceId: ctx.params.id,
        userAgent: ctx.params.user,
        ctx,
      });
      return { status: 200, feedback };
    },
  },
  setInstanceFeedbackRest: {
    openapi: setInstanceFeedbackRest.openapi,
    rest: {
      method: 'POST',
      path: '/instance/feedback',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const feedback = await setFeedback({
        instanceId: ctx.params.id,
        userAgent: ctx.params.user,
        feedback: ctx.params.feedback,
        ctx,
      });
      return { status: 200, feedback };
    },
  },
  setInstanceTimestampRest: {
    openapi: setInstanceTimestampRest.openapi,
    rest: {
      method: 'POST',
      path: '/instance/timestamp',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { timestamps } = await setInstanceTimestamp({
        instanceId: ctx.params.instance,
        timeKey: ctx.params.timeKey,
        user: ctx.params.user || ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, timestamps };
    },
  },
  setQuestionResponseRest: {
    openapi: setQuestionResponseRest.openapi,
    rest: {
      method: 'POST',
      path: '/instance/question/response',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const question = await setQuestionResponse({
        data: ctx.params,
        ctx,
      });
      return { status: 200, question };
    },
  },
  getUserQuestionResponsesRest: {
    openapi: getUserQuestionResponsesRest.openapi,
    rest: {
      method: 'GET',
      path: '/instance/:id/question/response',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const responses = await getUserQuestionResponses({
        instance: ctx.params.id,
        userAgent: ctx.params.user || ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, responses };
    },
  },
};
