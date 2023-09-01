/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { LeemonsValidator } = require('leemons-validator');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('leemons-middlewares');

const {
  validatePutSubjectCredits,
  validateGetSubjectCredits,
  validateGetSubjectCreditsProgram,
  validateGetSubjectsCredits,
} = require('../../validations/forms');
const {
  addSubject,
  updateSubject,
  deleteSubjectWithClasses,
  setSubjectCredits,
  getSubjectsCredits,
  getSubjectCredits,
  listSubjectCreditsForProgram,
  listSubjects,
  subjectByIds,
} = require('../../core/subjects');

/** @type {ServiceSchema} */
module.exports = {
  postSubjectRest: {
    rest: {
      path: '/',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.subjects': {
            actions: ['admin', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const subject = await addSubject({ data: ctx.params, ctx });
      return { status: 200, subject };
    },
  },
  putSubjectRest: {
    rest: {
      path: '/',
      method: 'PUT',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.subjects': {
            actions: ['admin', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const subject = await updateSubject({ data: ctx.params, ctx });
      return { status: 200, subject };
    },
  },
  deleteSubjectRest: {
    rest: {
      path: '/:id',
      method: 'DELETE',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.subjects': {
            actions: ['admin', 'delete'],
          },
        },
      }),
    ],

    async handler(ctx) {
      await deleteSubjectWithClasses({ id: ctx.params.id, ctx });
      return { status: 200 };
    },
  },
  putSubjectCreditsRest: {
    rest: {
      path: '/credits',
      method: 'PUT',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.subjects': {
            actions: ['admin', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      validatePutSubjectCredits(ctx.params);
      const { subject, program, credits } = ctx.params;
      const subjectCredits = await setSubjectCredits({ subject, program, credits, ctx });
      return { status: 200, subjectCredits };
    },
  },
  getSubjectCreditsRest: {
    rest: {
      path: '/credits',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      let { subjects } = ctx.params;
      if (subjects) {
        subjects = JSON.parse(subjects);
        validateGetSubjectsCredits(subjects);
        const subjectsCredits = await getSubjectsCredits({ subjects, ctx });
        return { status: 200, subjectsCredits };
      }
      validateGetSubjectCredits(ctx.params);
      const { subject, program } = ctx.params;
      const subjectCredits = await getSubjectCredits({ subject, program, ctx });
      return { status: 200, subjectCredits };
    },
  },
  listSubjectCreditsForProgramRest: {
    rest: {
      path: '/credits/list',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.subjects': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      validateGetSubjectCreditsProgram(ctx.params);
      const { program } = ctx.params;
      const subjectCredits = await listSubjectCreditsForProgram({ program, ctx });
      return { status: 200, subjectCredits };
    },
  },
  listSubjectRest: {
    rest: {
      path: '/',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.subjects': {
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
          program: { type: 'string' },
          course: { type: 'string' },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const { page, size, program, course } = ctx.params;
        const data = await listSubjects({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          program,
          course,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  subjectByIdsRest: {
    rest: {
      path: '/:id',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.subjects': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      let { id } = ctx.params;
      if (!id) {
        const { ids } = ctx.params;
        id = JSON.parse(ids);
      }
      const data = await subjectByIds({ ids: Array.isArray(id) ? id : [id], ctx });
      if (ctx.params.id) {
        return { status: 200, data: data && data[0] };
      }
      return { status: 200, data };
    },
  },
};
