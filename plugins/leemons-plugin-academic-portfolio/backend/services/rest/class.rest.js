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
const { pick } = require('lodash');

const { getUserEnrollments, getClassPublicData } = require('../../core/classes');
const { addClass } = require('../../core/classes/addClass');
const { addClassStudentsMany } = require('../../core/classes/addClassStudentsMany');
const { addClassTeachersMany } = require('../../core/classes/addClassTeachersMany');
const { addInstanceClass } = require('../../core/classes/addInstanceClass');
const { classByIds } = require('../../core/classes/classByIds');
const { classDetailForDashboard } = require('../../core/classes/classDetailForDashboard');
const { haveClasses } = require('../../core/classes/haveClasses');
const { listClasses } = require('../../core/classes/listClasses');
const { listSessionClasses } = require('../../core/classes/listSessionClasses');
const { listStudentClasses } = require('../../core/classes/listStudentClasses');
const { listSubjectClasses } = require('../../core/classes/listSubjectClasses');
const { listTeacherClasses } = require('../../core/classes/listTeacherClasses');
const { removeClassesByIds } = require('../../core/classes/removeClassesByIds');
const { remove: removeStudentFromClass } = require('../../core/classes/student/remove');
const { updateClass } = require('../../core/classes/updateClass');
const { updateClassMany } = require('../../core/classes/updateClassMany');

/** @type {ServiceSchema} */
module.exports = {
  haveClassesRest: {
    rest: {
      path: '/have',
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
      const have = await haveClasses({ ctx });
      return { status: 200, have };
    },
  },
  postClassRest: {
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
      const _class = await addClass({ data: ctx.params, ctx });
      return { status: 200, class: _class };
    },
  },
  putClassRest: {
    rest: {
      path: '/',
      method: 'PUT',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.subjects': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const _class = await updateClass({ data: ctx.params, ctx });
      return { status: 200, class: _class };
    },
  },
  putClassManyRest: {
    rest: {
      path: '/many',
      method: 'PUT',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.subjects': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const classes = await updateClassMany({ data: ctx.params, ctx });
      return { status: 200, classes };
    },
  },
  postClassInstanceRest: {
    rest: {
      path: '/instance',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.subjects': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const _class = await addInstanceClass({ data: ctx.params, ctx });
      return { status: 200, class: _class };
    },
  },
  listClassRest: {
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
        },
        required: ['page', 'size', 'program'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const { page, size, program, ...options } = ctx.params;
        const data = await listClasses({
          ...options,
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          program,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  listSubjectClassesRest: {
    rest: {
      path: '/subjects/class',
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
          subject: { type: 'string' },
        },
        required: ['page', 'size', 'subject'],
        additionalProperties: false,
      });

      if (validator.validate(ctx.params)) {
        const { page, size, subject } = ctx.params;

        const data = await listSubjectClasses({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          subject,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  listMultipleSubjectsClassesRest: {
    rest: {
      path: '/subjects/multiple',
      method: 'POST',
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
          subjects: { type: 'array' },
        },
        required: ['page', 'size', 'subjects'],
        additionalProperties: false,
      });

      if (validator.validate(ctx.params)) {
        const { page, size, subjects } = ctx.params;

        const data = await listSubjectClasses({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          subject: subjects,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  postClassStudentsRest: {
    rest: {
      path: '/students',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.subjects': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const _class = await addClassStudentsMany({ data: ctx.params, ctx });
      return { status: 200, class: _class };
    },
  },
  postClassTeachersRest: {
    rest: {
      path: '/teachers',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.subjects': {
            actions: ['admin', 'create', 'update'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const _class = await addClassTeachersMany({ data: ctx.params, ctx });
      return { status: 200, class: _class };
    },
  },
  listStudentClassesRest: {
    rest: {
      path: '/student/:id',
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
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.param)) {
        const { page, size } = ctx.param;
        const data = await listStudentClasses({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          student: ctx.params.id,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  listTeacherClassesRest: {
    rest: {
      path: '/teacher/:id',
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
          id: { type: 'string' },
          page: { type: ['number', 'string'] },
          size: { type: ['number', 'string'] },
        },
        required: ['page', 'size', 'id'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const { page, size } = ctx.params;
        const data = await listTeacherClasses({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          teacher: ctx.params.id,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  removeClassRest: {
    rest: {
      path: '/:id',
      method: 'DELETE',
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
      const data = await removeClassesByIds({ ids: ctx.params.id, soft: true, ctx });
      return { status: 200, data };
    },
  },
  removeStudentRest: {
    rest: {
      path: '/remove/students',
      method: 'POST',
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
      const data = await removeStudentFromClass({
        classId: ctx.params.class,
        studentId: ctx.params.student,
        ctx,
      });
      return { status: 200, data };
    },
  },
  listSessionClassesRest: {
    rest: {
      path: '/session',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const classes = await listSessionClasses({ ...ctx.params, ctx });
      return { status: 200, classes };
    },
  },
  classDetailForDashboardRest: {
    rest: {
      path: '/dashboard/:id',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const data = await classDetailForDashboard({
        classId: ctx.params.id,
        teacherType: ctx.params.teacherType ? JSON.parse(ctx.params.teacherType) : undefined,
        ctx,
      });
      return { status: 200, ...data };
    },
  },
  classByIdsRest: {
    rest: {
      // raw porque a diferencia del get a '/' no utiliza mongoDBPaginate();
      path: '/raw-list',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const ids = JSON.parse(ctx.params.ids || null);
      const classes = await classByIds({
        ids,
        noSearchChildren: ctx.params.noSearchChildren,
        noSearchParents: ctx.params.noSearchParents,
        ctx,
      });
      return { status: 200, classes };
    },
  },
  getUserEnrollments: {
    rest: {
      path: '/user-enrollments',
      method: 'POST',
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
          userAgentIds: { type: 'array' },
          centerId: { type: 'string' },
          contactUserAgentId: { type: 'string' },
        },
        required: ['userAgentIds', 'centerId'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const { userAgentIds, centerId, contactUserAgentId } = ctx.params;
        const data = await getUserEnrollments({ userAgentIds, centerId, contactUserAgentId, ctx });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
  classPublicDataRest: {
    rest: {
      path: '/:id/public-data',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const publicData = await getClassPublicData({ ids: ctx.params.id, ctx });
      return { status: 200, class: publicData };
    },
  },
  classPublicDataManyRest: {
    rest: {
      path: '/public-data',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const publicData = await getClassPublicData({ ids: ctx.params.ids, ctx });
      return { status: 200, classes: publicData };
    },
  },
};
