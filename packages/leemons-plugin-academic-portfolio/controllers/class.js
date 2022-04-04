const _ = require('lodash');
const classService = require('../src/services/classes');
const { remove: removeStudentFromClass } = require('../src/services/classes/student/remove');

async function haveClasses(ctx) {
  const have = await classService.haveClasses();
  ctx.status = 200;
  ctx.body = { status: 200, have };
}

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

async function putClassMany(ctx) {
  const classes = await classService.updateClassMany(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, classes };
}

async function postClassInstance(ctx) {
  const _class = await classService.addInstanceClass(ctx.request.body);
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
  const _class = await classService.addClassStudentsMany(ctx.request.body);
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
  const _class = await classService.addClassTeachersMany(ctx.request.body);
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

async function removeClass(ctx) {
  const data = await classService.removeClassesByIds(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200, data };
}

async function removeStudent(ctx) {
  const data = await removeStudentFromClass(ctx.request.body.class, ctx.request.body.student);
  ctx.status = 200;
  ctx.body = { status: 200, data };
}

async function listSessionClasses(ctx) {
  const classes = await classService.listSessionClasses(ctx.state.userSession, ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, classes };
}

async function classDetailForDashboard(ctx) {
  const data = await classService.classDetailForDashboard(
    ctx.request.params.id,
    ctx.state.userSession
  );
  ctx.status = 200;
  ctx.body = { status: 200, ...data };
}

module.exports = {
  postClass,
  putClass,
  listClass,
  haveClasses,
  removeClass,
  putClassMany,
  removeStudent,
  postClassInstance,
  postClassStudents,
  postClassTeachers,
  listSessionClasses,
  listStudentClasses,
  listTeacherClasses,
  classDetailForDashboard,
};
