const _ = require('lodash');
const classService = require('../src/services/classes');

async function postClass(ctx) {
  const _class = await classService.addClass(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, class: _class };
}

async function putClass(ctx) {
  const _class = await classService.updateClass(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, class: _class };
}

async function listClass(ctx) {
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
    const data = await classService.listClasses(parseInt(page, 10), parseInt(size, 10), program, {
      ...options,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

async function postClassStudents(ctx) {
  if (process.env.NODE_ENV !== 'production') {
    if (!_.isArray(ctx.request.body.students)) {
      ctx.request.body.students = [];
    }
    ctx.request.body.students.push(ctx.state.userSession.userAgents[0].id);
  }
  const _class = await classService.addClassStudents(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, class: _class };
}

async function postClassTeachers(ctx) {
  if (process.env.NODE_ENV !== 'production') {
    if (!_.isArray(ctx.request.body.teachers)) {
      ctx.request.body.teachers = [];
    }
    ctx.request.body.teachers.push({
      teacher: ctx.state.userSession.userAgents[0].id,
      type: 'teacher',
    });
  }
  const _class = await classService.addClassTeachers(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, class: _class };
}

async function listStudentClasses(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const { page, size, ...options } = ctx.request.query;
    const data = await classService.listStudentClasses(
      parseInt(page, 10),
      parseInt(size, 10),
      ctx.request.params.id,
      {
        ...options,
      }
    );
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

async function listTeacherClasses(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const { page, size, ...options } = ctx.request.query;
    const data = await classService.listTeacherClasses(
      parseInt(page, 10),
      parseInt(size, 10),
      ctx.request.params.id,
      {
        ...options,
      }
    );
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

module.exports = {
  postClass,
  putClass,
  listClass,
  postClassStudents,
  postClassTeachers,
  listStudentClasses,
  listTeacherClasses,
};
