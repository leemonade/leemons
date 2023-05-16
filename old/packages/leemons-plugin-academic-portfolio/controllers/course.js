const courseService = require('../src/services/courses');

async function postCourse(ctx) {
  ctx.status = 400;
  ctx.body = { status: 400, message: 'Course creation disabled' };
  /*
  const course = await courseService.addCourse(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, course };
   */
}

async function putCourse(ctx) {
  const course = await courseService.updateCourse(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, course };
}

async function listCourse(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
      program: { type: 'string' },
    },
    required: ['page', 'size', 'program'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const { page, size, program, ...options } = ctx.request.query;
    const data = await courseService.listCourses(parseInt(page, 10), parseInt(size, 10), program, {
      ...options,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

module.exports = {
  postCourse,
  listCourse,
  putCourse,
};
