/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { LeemonsValidator } = require('leemons-validator');

const { haveClasses } = require('../../core/classes/haveClasses');
const { addClass } = require('../../core/classes/addClass');
const { updateClass } = require('../../core/classes/updateClass');
const { updateClassMany } = require('../../core/classes/updateClassMany');
const { addInstanceClass } = require('../../core/classes/addInstanceClass');
const { listClasses } = require('../../core/classes/listClasses');
const { listSubjectClasses } = require('../../core/classes/listSubjectClasses');
const { addClassStudentsMany } = require('../../core/classes/addClassStudentsMany');
const { addClassTeachersMany } = require('../../core/classes/addClassTeachersMany');
const { listStudentClasses } = require('../../core/classes/listStudentClasses');
const { listTeacherClasses } = require('../../core/classes/listTeacherClasses');
const { removeClassesByIds } = require('../../core/classes/removeClassesByIds');

/** @type {ServiceSchema} */
module.exports = {
  haveClassesRest: {
    rest: {
      path: '/classes/have',
      method: 'GET',
    },
    async handler(ctx) {
      const have = await haveClasses({ ctx });
      return { status: 200, have };
    },
  },
  postClassRest: {
    rest: {
      path: '/class',
      method: 'POST',
    },
    async handler(ctx) {
      const data = JSON.parse(ctx.params.data);
      _.forIn(ctx.params.files, (value, key) => {
        _.set(data, key, value);
      });
      const _class = await addClass({ data, ctx });
      return { status: 200, class: _class };
    },
  },
  putClassRest: {
    rest: {
      path: '/class',
      method: 'PUT',
    },
    async handler(ctx) {
      const data = JSON.parse(ctx.params.data);
      _.forIn(ctx.params.files, (value, key) => {
        _.set(data, key, value);
      });
      const _class = await updateClass({ data, ctx });
      return { status: 200, class: _class };
    },
  },
  putClassManyRest: {
    rest: {
      path: '/class/many',
      method: 'PUT',
    },
    async handler(ctx) {
      const classes = await updateClassMany({ data: ctx.params, ctx });
      return { status: 200, classes };
    },
  },
  postClassInstanceRest: {
    rest: {
      path: '/class/instance',
      method: 'POST',
    },
    async handler(ctx) {
      const _class = await addInstanceClass({ data: ctx.params, ctx });
      return { status: 200, class: _class };
    },
  },
  listClassRest: {
    rest: {
      path: '/class',
      method: 'GET',
    },
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
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          program,
          query: {
            ...options,
          },
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
    listSubjectClassesRest: {
      rest: {
        path: '/subjects/class',
        method: 'GET',
      },
      async handler(ctx) {
        const validator = new LeemonsValidator({
          type: 'object',
          properties: {
            page: { type: ['number', 'string'] },
            size: { type: ['number', 'string'] },
            subject: { type: 'string', format: 'uuid' },
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
            query: {
              userSession: ctx.meta.userSession,
            },
            ctx,
          });
          return { status: 200, data };
        }
        throw validator.error;
      },
    },
    postClassStudentsRest: {
      rest: {
        path: '/class/students',
        method: 'POST',
      },
      async handler(ctx) {
        if (process.env.NODE_ENV !== 'production') {
          if (!_.isArray(ctx.params.students)) {
            ctx.params.students = [];
          }
          ctx.params.students.push(ctx.meta.userSession.userAgents[0].id);
        }
        const _class = await addClassStudentsMany({ data: ctx.params, ctx });
        return { status: 200, class: _class };
      },
    },
    postClassTeachersRest: {
      rest: {
        path: '/class/teachers',
        method: 'POST',
      },
      async handler(ctx) {
        if (process.env.NODE_ENV !== 'production') {
          if (!_.isArray(ctx.params.teachers)) {
            ctx.params.teachers = [];
          }
          ctx.params.teachers.push({
            teacher: ctx.meta.userSession.userAgents[0].id,
            type: 'teacher',
          });
        }
        const _class = await addClassTeachersMany({ data: ctx.params, ctx });
        return { status: 200, class: _class };
      },
    },
    listStudentClassesRest: {
      rest: {
        path: '/student/:id/classes',
        method: 'GET',
      },
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
        path: '/teacher/:id/classes',
        method: 'GET',
      },
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
        path: '/class/:id',
        method: 'DELETE',
      },
      async handler(ctx) {
        const data = await removeClassesByIds({ ids: ctx.params.id, soft: true, ctx });
        return { status: 200, data };
      },
    },
  },
};
