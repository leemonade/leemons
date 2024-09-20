/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsError } = require('@leemons/error');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { LeemonsValidator } = require('@leemons/validator');
const _ = require('lodash');

const { duplicateClassesByIds } = require('../../core/classes/duplicateClassesByIds');
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
  isMainTeacherInSubject,
} = require('../../core/subjects');
const { duplicateSubjectByIds } = require('../../core/subjects/duplicateSubjectByIds');
const {
  validatePutSubjectCredits,
  validateGetSubjectCredits,
  validateGetSubjectCreditsProgram,
  validateGetSubjectsCredits,
} = require('../../validations/forms');

/** @type {ServiceSchema} */
module.exports = {
  postSubjectRest: {
    rest: {
      path: '/subject',
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
      path: '/subject',
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
      const _soft = ctx.params.soft ? JSON.parse(ctx.params.soft) : undefined;
      await deleteSubjectWithClasses({ id: ctx.params.id, soft: _soft, ctx });
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
        subjects = JSON.parse(subjects || null);
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
      path: '/subject',
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
          course: { type: 'string' }, // Stringified array, even for one
          onlyArchived: { type: 'string' },
          teacherTypeFilter: { type: 'string' },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const { page, size, program, course, onlyArchived, teacherTypeFilter } = ctx.params;
        const truthyValues = ['true', true, '1'];
        const _onlyArchived = truthyValues.includes(onlyArchived);

        let _course;
        try {
          _course = JSON.parse(course || 'null');
        } catch (error) {
          throw new LeemonsError(ctx, {
            message: 'Course must be a valid JSON array',
            statusCode: 400,
          });
        }

        const data = await listSubjects({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          program,
          course: _course,
          onlyArchived: _onlyArchived,
          teacherTypeFilter,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  subjectsByIdsRest: {
    rest: {
      path: '/',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      let { id } = ctx.params;
      if (!id) {
        const { ids } = ctx.params;
        id = JSON.parse(ids || null);
      }
      const truthyValues = ['true', true, '1'];
      const _withClasses = truthyValues.includes(ctx.params.withClasses);
      const _showArchived = truthyValues.includes(ctx.params.showArchived);
      const data = await subjectByIds({
        ids: Array.isArray(id) ? id : [id],
        withClasses: _withClasses,
        showArchived: _showArchived,
        ctx,
      });
      if (ctx.params.id) {
        return { status: 200, data: data && data[0] };
      }
      return { status: 200, data };
    },
  },
  duplicateSubjectById: {
    rest: {
      path: '/:id/duplicate',
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
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          id: { type: 'string' },
          course: { type: 'string' },
        },
        required: ['id'],
        additionalProperties: true,
      });
      if (validator.validate(ctx.params)) {
        const { id } = ctx.params;

        const duplications = await duplicateSubjectByIds({
          ids: id,
          preserveName: ctx.params.preserveName,
          ctx,
        });
        const classes = await ctx.tx.db.Class.find({ subject: id }).lean();
        await duplicateClassesByIds({
          ids: _.map(classes, 'id'),
          duplications,
          students: false,
          teachers: false,
          groups: true,
          courses: true,
          substages: true,
          knowledges: true,
          ctx,
        });
        const [subject] = await subjectByIds({
          ids: Object.values(duplications.subjects)[0].id,
          withClasses: true,
          ctx,
        });

        return { status: 200, subject };
      }
      throw validator.error;
    },
  },
  isMainTeacherInSubjectRest: {
    rest: {
      path: '/is-main-teacher-in-subject',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { subjectIds } = ctx.params;
      const parsedSubjectIds = JSON.parse(subjectIds || '[]');

      const isMainTeacher = await isMainTeacherInSubject({ subjectIds: parsedSubjectIds, ctx });
      return {
        status: 200,
        isMainTeacher,
      };
    },
  },
};
