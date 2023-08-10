/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { updateCourse } = require('../../core/courses');

/** @type {ServiceSchema} */
module.exports = {
  postCourseRest: {
    rest: {},
    async handler() {
      /*
      const course = await courseService.addCourse(ctx.request.body);
      ctx.status = 200;
      ctx.body = { status: 200, course };
      */
      return { status: 400, message: 'Course creation disabled' };
    },
  },
  putCourse: {
    rest: {},
    async handler(ctx) {
      const course = await updateCourse(ctx.request.body);
      return { status: 200, course };
    },
  },
};
