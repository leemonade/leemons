/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { LeemonsValidator } = require('leemons-validator');

const {
  LeemonsMiddlewareNecessaryPermits,
  LeemonsMiddlewareAuthenticated,
} = require('leemons-middlewares');

const {
  getProgramTree,
  havePrograms,
  addProgram,
  listPrograms,
  programsByIds,
  updateProgram,
  getProgramCourses,
  getProgramGroups,
  getProgramSubstages,
  removeProgramByIds,
  duplicateProgramByIds,
  addStudentsToClassesUnderNodeTree,
  getUserPrograms,
  getProgramEvaluationSystem,
} = require('../../core/programs');

/** @type {ServiceSchema} */
module.exports = {
  getProgramTreeRest: {
    rest: {
      path: '/:id/tree',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const tree = await getProgramTree({ programId: ctx.params.id, ctx });
      return { status: 200, tree };
    },
  },
  haveProgramsRest: {
    rest: {
      path: '/have',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const have = await havePrograms({ ctx });
      return { status: 200, have };
    },
  },
  postProgramRest: {
    rest: {
      path: '/',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const program = await addProgram({
        data: ctx.params,
        userSession: ctx.meta.userSession,
        ctx,
      });
      return { status: 200, program };
    },
  },
  putProgramRest: {
    rest: {
      path: '/',
      method: 'PUT',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const data = JSON.parse(ctx.params.data);
      _.forIn(ctx.params.files, (value, key) => {
        _.set(data, key, value);
      });
      const program = await updateProgram({ data, ctx });
      return { status: 200, program };
    },
  },
  listProgramRest: {
    rest: {
      path: '/',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          page: { type: ['number', 'string'] },
          size: { type: ['number', 'string'] },
          center: { type: ['string'] },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });

      if (validator.validate(ctx.params)) {
        const { page, size, center, ...options } = ctx.params;
        const data = await listPrograms({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          center,
          ...options,
          ctx,
        });
        return { status: 200, data };
      }

      throw validator.error;
    },
  },
  detailProgramRest: {
    rest: {
      path: '/:id',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const [program] = await programsByIds({ ids: ctx.params.id, ctx });
      if (!program) throw new LeemonsError(ctx, { message: 'Program not found' });
      return { status: 200, program };
    },
  },
  programHasCoursesRest: {
    rest: {
      path: '/:id/has/courses',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const courses = await getProgramCourses({ ids: ctx.params.id, ctx });
      return { status: 200, has: courses.length > 0 };
    },
  },
  programHasGroupsRest: {
    rest: {
      path: '/:id/has/groups',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const groups = await getProgramGroups({ ids: ctx.params.id, ctx });
      return { status: 200, has: groups.length > 0 };
    },
  },
  programHasSubstagesRest: {
    rest: {
      path: '/:id/has/substages',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const substages = await getProgramSubstages({ ids: ctx.params.id, ctx });
      return { status: 200, has: substages.length > 0 };
    },
  },
  programCoursesRest: {
    rest: {
      path: '/:id/courses',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const courses = await getProgramCourses({ ids: ctx.params.id, ctx });
      return { status: 200, courses };
    },
  },
  programGroupsRest: {
    rest: {
      path: '/:id/groups',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const groups = await getProgramGroups({ ids: ctx.params.id, ctx });
      return { status: 200, groups };
    },
  },
  programSubstagesRest: {
    rest: {
      path: '/:id/substages',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const substages = await getProgramSubstages({ ids: ctx.params.id, ctx });
      return { status: 200, substages };
    },
  },
  deleteProgramRest: {
    rest: {
      path: '/:id',
      method: 'DELETE',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'delete'],
          },
        },
      }),
    ],
    async handler(ctx) {
      await removeProgramByIds({
        ids: ctx.params.id,
        soft: ctx.params.soft === 'true',
        ctx,
      });
      return { status: 200 };
    },
  },
  duplicateProgramRest: {
    rest: {
      path: '/:id/duplicate',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const [program] = await duplicateProgramByIds({ ids: ctx.params.id, ctx });
      return { status: 200, program };
    },
  },
  addStudentsToClassesUnderNodeTreeRest: {
    rest: {
      path: '/add-students-to-classes-under-node-tree',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.programs': {
            actions: ['admin', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const data = await addStudentsToClassesUnderNodeTree({
        ...ctx.params,
        ctx,
      });
      return { status: 200, data };
    },
  },
  getUserProgramsRest: {
    rest: {
      path: '/user',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const programs = await getUserPrograms({ ctx });
      return { status: 200, programs };
    },
  },
  getProgramEvaluationSystemRest: {
    rest: {
      path: '/:id/evaluation-system',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const evaluationSystem = await getProgramEvaluationSystem({ id: ctx.params.id, ctx });
      return { status: 200, evaluationSystem };
    },
  },
};
