/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsValidator } = require('leemons-validator');
const { updateCourse, listCourses } = require('../../core/courses');

/** @type {ServiceSchema} */
module.exports = {
  postCourseRest: {
    rest: {
      path: '/course',
      method: 'POST',
    },
    async handler() {
      /*
      const course = await courseService.addCourse(ctx.params;
      return { status: 200, course };
      */
      return { status: 400, message: 'Course creation disabled' };
    },
  },
  putCourseRest: {
    rest: {
      path: '/course',
      method: 'PUT',
    },
    async handler(ctx) {
      const course = await updateCourse({ data: ctx.params, ctx });
      return { status: 200, course };
    },
  },
  listCourseRest: {
    rest: {
      path: '/course',
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
        const { page, size, program } = ctx.params;
        const data = await listCourses({
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
};
