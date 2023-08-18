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

const { listClassesSubjects } = require('../../core/common/listClassesSubjects');
const {
  getTree,
  getClassesUnderNodeTree,
  addTeachersClassesUnderNodeTree,
  getStudentsByTags,
} = require('../../core/common');

/** @type {ServiceSchema} */
module.exports = {
  listClassSubjectsRest: {
    rest: {
      path: '/class-subjects',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'permissions.subjects': {
          actions: ['view'],
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
        const { classes, subjects } = await listClassesSubjects({ program, course, group, ctx });
        return { status: 200, classes, subjects };
      }
      throw validator.error;
    },
  },
  getTreeRest: {
    rest: {
      path: '/tree',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'permissions.tree': {
          actions: ['view'],
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
    rest: {
      path: '/classes-under-node-tree',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'permissions.tree': {
          actions: ['view'],
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
      const classes = await getClassesUnderNodeTree({ nodeTypes, nodeType, nodeId, ctx });
      return { status: 200, classes };
    },
  },
  addStudentsToClassesUnderNodeTreeRest: {
    rest: {
      path: '/classes-under-node-tree',
      method: 'GET',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'permissions.subjects': {
          actions: ['update'],
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
      const classes = await getClassesUnderNodeTree({ nodeTypes, nodeType, nodeId, ctx });
      return { status: 200, classes };
    },
  },
  addTeachersToClassesUnderNodeTree: {
    rest: {
      path: '/add-teachers-to-classes-under-node-tree',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'permissions.subjects': {
          actions: ['update'],
        },
      }),
    ],
    async handler(ctx) {
      if (process.env.NODE_ENV !== 'production') {
        if (!_.isArray(ctx.params.students)) {
          ctx.params.teachers = [];
        }
        ctx.params.teachers.push({
          teacher: ctx.meta.userSession.userAgents[0].id,
          type: 'teacher',
        });
      }
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
    rest: {
      path: '/students/by/tags',
      method: 'POST',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        'permissions.subjects': {
          actions: ['view'],
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
