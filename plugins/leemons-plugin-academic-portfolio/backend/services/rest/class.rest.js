/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsValidator } = require('@leemons/validator');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const { haveClasses } = require('../../core/classes/haveClasses');
const { addClass } = require('../../core/classes/addClass');
const { updateClass } = require('../../core/classes/updateClass');
const { updateClassMany } = require('../../core/classes/updateClassMany');
const { addInstanceClass } = require('../../core/classes/addInstanceClass');
const { listClasses } = require('../../core/classes/listClasses');
const { listSubjectClasses } = require('../../core/classes/listSubjectClasses');
const {
  addClassStudentsMany,
} = require('../../core/classes/addClassStudentsMany');
const {
  addClassTeachersMany,
} = require('../../core/classes/addClassTeachersMany');
const { listStudentClasses } = require('../../core/classes/listStudentClasses');
const { listTeacherClasses } = require('../../core/classes/listTeacherClasses');
const { removeClassesByIds } = require('../../core/classes/removeClassesByIds');
const {
  remove: removeStudentFromClass,
} = require('../../core/classes/student/remove');
const { listSessionClasses } = require('../../core/classes/listSessionClasses');
const {
  classDetailForDashboard,
} = require('../../core/classes/classDetailForDashboard');
const { classByIds } = require('../../core/classes/classByIds');
const { getUserEnrollments } = require('../../core/classes');

const haveClassesRest = require('./openapi/classes/haveClassesRest');
const postClassRest = require('./openapi/classes/postClassRest');
const putClassRest = require('./openapi/classes/putClassRest');
const putClassManyRest = require('./openapi/classes/putClassManyRest');
const postClassInstanceRest = require('./openapi/classes/postClassInstanceRest');
const listClassRest = require('./openapi/classes/listClassRest');
const listSubjectClassesRest = require('./openapi/classes/listSubjectClassesRest');
const listMultipleSubjectsClassesRest = require('./openapi/classes/listMultipleSubjectsClassesRest');
const postClassStudentsRest = require('./openapi/classes/postClassStudentsRest');
const postClassTeachersRest = require('./openapi/classes/postClassTeachersRest');
const listStudentClassesRest = require('./openapi/classes/listStudentClassesRest');
const listTeacherClassesRest = require('./openapi/classes/listTeacherClassesRest');
const removeClassRest = require('./openapi/classes/removeClassRest');
const removeStudentRest = require('./openapi/classes/removeStudentRest');
const listSessionClassesRest = require('./openapi/classes/listSessionClassesRest');
const classDetailForDashboardRest = require('./openapi/classes/classDetailForDashboardRest');
const classByIdsRest = require('./openapi/classes/classByIdsRest');
/** @type {ServiceSchema} */
module.exports = {
  haveClassesRest: {
    openapi: haveClassesRest.openapi,
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
    openapi: postClassRest.openapi,
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
    openapi: putClassRest.openapi,
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
    openapi: putClassManyRest.openapi,
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
    openapi: postClassInstanceRest.openapi,
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
    openapi: listClassRest.openapi,
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
    openapi: listSubjectClassesRest.openapi,
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
    openapi: listMultipleSubjectsClassesRest.openapi,
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
    openapi: postClassStudentsRest.openapi,
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
    openapi: postClassTeachersRest.openapi,
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
    openapi: listStudentClassesRest.openapi,
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
    openapi: listTeacherClassesRest.openapi,
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
    openapi: removeClassRest.openapi,
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
      const data = await removeClassesByIds({
        ids: ctx.params.id,
        soft: true,
        ctx,
      });
      return { status: 200, data };
    },
  },
  removeStudentRest: {
    openapi: removeStudentRest.openapi,
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
    openapi: listSessionClassesRest.openapi,
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
    openapi: classDetailForDashboardRest.openapi,
    rest: {
      path: '/dashboard/:id',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const data = await classDetailForDashboard({
        classId: ctx.params.id,
        ctx,
      });
      return { status: 200, ...data };
    },
  },
  classByIdsRest: {
    openapi: classByIdsRest.openapi,
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
        const data = await getUserEnrollments({
          userAgentIds,
          centerId,
          contactUserAgentId,
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
};
