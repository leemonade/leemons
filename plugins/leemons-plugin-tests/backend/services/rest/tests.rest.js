/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { LeemonsValidator } = require('@leemons/validator');
const _ = require('lodash');

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
  createAssignSavedConfig,
  setOpenQuestionGrade,
} = require('../../core/tests');

/** @type {ServiceSchema} */
module.exports = {
  listTestsRest: {
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
  createAssignConfigRest: {
    rest: {
      method: 'POST',
      path: '/assign/configs',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'tests.tests': {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { name, config } = ctx.params;

      const id = await createAssignSavedConfig({
        name,
        config,
        ctx,
      });

      return { status: 200, id };
    },
  },
  updateAssignConfigRest: {
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
  gradeOpenQuestionRest: {
    rest: {
      method: 'POST',
      path: '/instance/question/grade',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const question = await setOpenQuestionGrade({
        data: ctx.params,
        ctx,
      });
      return { status: 200, question };
    },
  },
};
