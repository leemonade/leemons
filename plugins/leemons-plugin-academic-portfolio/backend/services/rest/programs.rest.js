/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsError } = require('@leemons/error');
const {
  LeemonsMiddlewareNecessaryPermits,
  LeemonsMiddlewareAuthenticated,
} = require('@leemons/middlewares');
const { LeemonsValidator } = require('@leemons/validator');
const _ = require('lodash');

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
  updateProgramConfiguration,
  getAcademicTree,
  getProgramCustomNomenclature,
  validateStaffChange,
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
      const program = await updateProgram({ data: ctx.params, ctx });
      return { status: 200, program };
    },
  },
  updateProgramConfiguration: {
    rest: {
      path: '/config',
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
      const program = await updateProgramConfiguration({ data: ctx.params, ctx });
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
        additionalProperties: true,
      });

      if (validator.validate(ctx.params)) {
        const { page, size, center, teacherTypeFilter } = ctx.params;
        let _onlyArchived = false;

        if ('archived' in ctx.params) {
          _onlyArchived = true;
        }

        const data = await listPrograms({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          center,
          teacherTypeFilter,
          onlyArchived: _onlyArchived,
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
      const truthyValues = ['true', true, '1'];
      const _withClasses = truthyValues.includes(ctx.params.withClasses);
      const _showArchived = truthyValues.includes(ctx.params.showArchived);
      const _withStudentsAndTeachers = truthyValues.includes(ctx.params.withStudentsAndTeachers);

      const [program] = await programsByIds({
        ids: ctx.params.id,
        withClasses: _withClasses,
        showArchived: _showArchived,
        withStudentsAndTeachers: _withStudentsAndTeachers,
        ctx,
      });
      if (!program) throw new LeemonsError(ctx, { message: 'Program not found' });
      return { status: 200, program };
    },
  },
  publicInfo: {
    rest: {
      path: '/publicInfo',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const programsInfo = await programsByIds({
        ids: ctx.params.ids,
        withClasses: ctx.params.withClasses ?? false,
        ctx,
      });

      const publicInfo = programsInfo.map((program) => ({
        courses: program.courses,
        id: program.id,
        maxNumberOfCourses: program.maxNumberOfCourses,
        moreThanOneAcademicYear: program.moreThanOneAcademicYear,
        name: program.name,
      }));

      return { status: 200, programs: publicInfo };
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
  hasProgramSubjectHistory: {
    rest: {
      path: '/:id/has-subject-history',
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
      const program = await programsByIds({ ids: ctx.params.id, showArchived: true, ctx });
      if (program?.length) {
        const { subjects } = program[0];
        return { status: 200, data: subjects?.length > 0 };
      }
      throw new LeemonsError(ctx, { message: 'Program not found', httpStatusCode: 404 });
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
      const result = await removeProgramByIds({
        ids: ctx.params.id,
        soft: ctx.params.soft === 'true',
        ctx,
      });
      return { status: 200, result };
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
      const [program] = await duplicateProgramByIds({
        ids: ctx.params.id,
        preserveName: ctx.params.preserveName,
        ctx,
      });
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
  getProgramAcademicTree: {
    rest: {
      path: '/:id/academic-tree',
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
      const tree = await getAcademicTree({ programId: ctx.params.id, ctx });
      return { status: 200, tree };
    },
  },
  getProgramNomenclature: {
    rest: {
      path: '/:id/nomenclature',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const allLocales = ctx.params.allLocales === 'true' || ctx.params.allLocales === '1';
      const nomenclature = await getProgramCustomNomenclature({
        ids: [ctx.params.id],
        allLocales,
        ctx,
      });
      return { status: 200, nomenclature };
    },
  },
  validateStaffChange: {
    rest: {
      path: '/validate-staff-change',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const data = await validateStaffChange({ data: ctx.params, ctx });
      return { status: 200, data };
    },
  },
};
