/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { LeemonsValidator } = require('@leemons/validator');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

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
const {
  duplicateSubjectByIds,
} = require('../../core/subjects/duplicateSubjectByIds');
const {
  duplicateClassesByIds,
} = require('../../core/classes/duplicateClassesByIds');

const postSubjectRest = require('./openapi/subjects/postSubjectRest');
const putSubjectRest = require('./openapi/subjects/putSubjectRest');
const deleteSubjectRest = require('./openapi/subjects/deleteSubjectRest');
const putSubjectCreditsRest = require('./openapi/subjects/putSubjectCreditsRest');
const getSubjectCreditsRest = require('./openapi/subjects/getSubjectCreditsRest');
const listSubjectCreditsForProgramRest = require('./openapi/subjects/listSubjectCreditsForProgramRest');
const listSubjectRest = require('./openapi/subjects/listSubjectRest');
const subjectsByIdsRest = require('./openapi/subjects/subjectsByIdsRest');
/** @type {ServiceSchema} */
module.exports = {
  postSubjectRest: {
    openapi: postSubjectRest.openapi,
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
    openapi: putSubjectRest.openapi,
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
    openapi: deleteSubjectRest.openapi,
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
    openapi: putSubjectCreditsRest.openapi,
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
      const subjectCredits = await setSubjectCredits({
        subject,
        program,
        credits,
        ctx,
      });
      return { status: 200, subjectCredits };
    },
  },
  getSubjectCreditsRest: {
    openapi: getSubjectCreditsRest.openapi,
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
    openapi: listSubjectCreditsForProgramRest.openapi,
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
      const subjectCredits = await listSubjectCreditsForProgram({
        program,
        ctx,
      });
      return { status: 200, subjectCredits };
    },
  },
  listSubjectRest: {
    openapi: listSubjectRest.openapi,
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
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const { page, size, program, course, onlyArchived } = ctx.params;
        const truthyValues = ['true', true, '1'];
        const _onlyArchived = truthyValues.includes(onlyArchived);

        const data = await listSubjects({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          program,
          course,
          onlyArchived: _onlyArchived,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  // ???
  // subjectsRest: {
  //   rest: {
  //     path: '/',
  //     method: 'GET',
  //   },
  //   middlewares: [LeemonsMiddlewareAuthenticated()],
  //   async handler(ctx) {
  //     let { id } = ctx.params;
  //     if (!id) {
  //       const { ids } = ctx.params;
  //       id = JSON.parse(ids || null);
  //     }
  //     const data = await subjectByIds({ ids: Array.isArray(id) ? id : [id], ctx });
  //     if (ctx.params.id) {
  //       return { status: 200, data: data && data[0] };
  //     }
  //     return { status: 200, data };
  //   },
  // },
  subjectsByIdsRest: {
    openapi: subjectsByIdsRest.openapi,
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
};
