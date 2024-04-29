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
  listClassesSubjects,
} = require('../../core/common/listClassesSubjects');
const {
  getTree,
  getClassesUnderNodeTree,
  addTeachersClassesUnderNodeTree,
  getStudentsByTags,
} = require('../../core/common');

const listClassSubjectsRest = require('./openapi/common/listClassSubjectsRest');
const getTreeRest = require('./openapi/common/getTreeRest');
const getClassesUnderNodeTreeRest = require('./openapi/common/getClassesUnderNodeTreeRest');
const addStudentsToClassesUnderNodeTreeRest = require('./openapi/common/addStudentsToClassesUnderNodeTreeRest');
const addTeachersToClassesUnderNodeTreeRest = require('./openapi/common/addTeachersToClassesUnderNodeTreeRest');
const getStudentsByTagsRest = require('./openapi/common/getStudentsByTagsRest');
/** @type {ServiceSchema} */
module.exports = {
  listClassSubjectsRest: {
    openapi: listClassSubjectsRest.openapi,
    rest: {
      path: '/class-subjects',
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
          program: { type: 'string' },
          course: { type: 'string' },
          group: { type: 'string' },
        },
        required: ['program'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const { program, course, group } = ctx.params;
        const { classes, subjects } = await listClassesSubjects({
          program,
          course,
          group,
          ctx,
        });
        return { status: 200, classes, subjects };
      }
      throw validator.error;
    },
  },
  getTreeRest: {
    openapi: getTreeRest.openapi,
    rest: {
      path: '/tree',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.tree': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { program } = ctx.params;
      let { nodeTypes } = ctx.params;
      if (typeof nodeTypes === 'string') {
        nodeTypes = ctx.params.nodeTypes
          .replace('[', '')
          .replace(']', '')
          .replaceAll("'", '')
          .replaceAll('"', '')
          .replaceAll(' ', '')
          .split(',');
      }
      const tree = await getTree({ nodeTypes, program, ctx });
      return { status: 200, tree };
    },
  },
  getClassesUnderNodeTreeRest: {
    openapi: getClassesUnderNodeTreeRest.openapi,
    rest: {
      path: '/classes-under-node-tree',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'academic-portfolio.tree': {
            actions: ['admin', 'view'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { nodeType, nodeId } = ctx.params;
      let { nodeTypes } = ctx.params;
      if (typeof nodeTypes === 'string') {
        nodeTypes = ctx.params.nodeTypes
          .replace('[', '')
          .replace(']', '')
          .replaceAll("'", '')
          .replaceAll('"', '')
          .replaceAll(' ', '')
          .split(',');
      }
      const classes = await getClassesUnderNodeTree({
        nodeTypes,
        nodeType,
        nodeId,
        ctx,
      });
      return { status: 200, classes };
    },
  },
  addStudentsToClassesUnderNodeTreeRest: {
    openapi: addStudentsToClassesUnderNodeTreeRest.openapi,
    rest: {
      path: '/add-students-to-classes-under-node-tree',
      method: 'POST',
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
      const { nodeType, nodeId } = ctx.params;
      let { nodeTypes } = ctx.params;
      if (typeof nodeTypes === 'string') {
        nodeTypes = ctx.params.nodeTypes
          .replace('[', '')
          .replace(']', '')
          .replaceAll("'", '')
          .replaceAll('"', '')
          .replaceAll(' ', '')
          .split(',');
      }
      const classes = await getClassesUnderNodeTree({
        nodeTypes,
        nodeType,
        nodeId,
        ctx,
      });
      return { status: 200, classes };
    },
  },
  addTeachersToClassesUnderNodeTreeRest: {
    openapi: addTeachersToClassesUnderNodeTreeRest.openapi,
    rest: {
      path: '/add-teachers-to-classes-under-node-tree',
      method: 'POST',
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
      const classes = await addTeachersClassesUnderNodeTree({
        nodeTypes: ctx.params.nodeTypes,
        nodeType: ctx.params.nodeType,
        nodeId: ctx.params.nodeId,
        teachers: ctx.params.teachers,
        ctx,
      });
      return { status: 200, classes };
    },
  },
  getStudentsByTagsRest: {
    openapi: getStudentsByTagsRest.openapi,
    rest: {
      path: '/students/by/tags',
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
      const students = await getStudentsByTags({
        tags: ctx.params.tags,
        center: ctx.params.center,
        ctx,
      });
      return { status: 200, students };
    },
  },
};
