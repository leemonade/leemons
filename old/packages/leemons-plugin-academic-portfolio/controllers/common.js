const _ = require('lodash');
const commonService = require('../src/services/common');

async function listClassSubjects(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      program: { type: 'string' },
      course: { type: 'string' },
      group: { type: 'string' },
    },
    required: ['program'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const { program, course, group, ...options } = ctx.request.query;
    const { classes, subjects } = await commonService.listClassesSubjects(
      { program, course, group },
      {
        ...options,
      }
    );
    ctx.status = 200;
    ctx.body = { status: 200, classes, subjects };
  } else {
    throw validator.error;
  }
}

async function getTree(ctx) {
  const { program } = ctx.request.query;
  let { nodeTypes } = ctx.request.query;
  if (typeof nodeTypes === 'string') {
    nodeTypes = ctx.request.query.nodeTypes
      .replace('[', '')
      .replace(']', '')
      .replaceAll("'", '')
      .replaceAll('"', '')
      .replaceAll(' ', '')
      .split(',');
  }
  const tree = await commonService.getTree(nodeTypes, { program });
  ctx.status = 200;
  ctx.body = { status: 200, tree };
}

async function getClassesUnderNodeTree(ctx) {
  let { nodeTypes } = ctx.request.query;
  if (typeof nodeTypes === 'string') {
    nodeTypes = ctx.request.query.nodeTypes
      .replace('[', '')
      .replace(']', '')
      .replaceAll("'", '')
      .replaceAll('"', '')
      .replaceAll(' ', '')
      .split(',');
  }
  const classes = await commonService.getClassesUnderNodeTree(
    nodeTypes,
    ctx.request.query.nodeType,
    ctx.request.query.nodeId
  );
  ctx.status = 200;
  ctx.body = { status: 200, classes };
}

async function addStudentsToClassesUnderNodeTree(ctx) {
  if (process.env.NODE_ENV !== 'production') {
    if (!_.isArray(ctx.request.body.students)) {
      ctx.request.body.students = [];
    }
    ctx.request.body.students.push(ctx.state.userSession.userAgents[0].id);
  }
  const classes = await commonService.addStudentsClassesUnderNodeTree(
    ctx.request.body.nodeTypes,
    ctx.request.body.nodeType,
    ctx.request.body.nodeId,
    ctx.request.body.students
  );
  ctx.status = 200;
  ctx.body = { status: 200, classes };
}

async function addTeachersToClassesUnderNodeTree(ctx) {
  if (process.env.NODE_ENV !== 'production') {
    if (!_.isArray(ctx.request.body.students)) {
      ctx.request.body.teachers = [];
    }
    ctx.request.body.teachers.push({
      teacher: ctx.state.userSession.userAgents[0].id,
      type: 'teacher',
    });
  }
  const classes = await commonService.addTeachersClassesUnderNodeTree(
    ctx.request.body.nodeTypes,
    ctx.request.body.nodeType,
    ctx.request.body.nodeId,
    ctx.request.body.teachers
  );
  ctx.status = 200;
  ctx.body = { status: 200, classes };
}

async function getStudentsByTags(ctx) {
  const students = await commonService.getStudentsByTags(ctx.request.body.tags, {
    center: ctx.request.body.center,
  });
  ctx.status = 200;
  ctx.body = { status: 200, students };
}

module.exports = {
  addTeachersToClassesUnderNodeTree,
  addStudentsToClassesUnderNodeTree,
  getClassesUnderNodeTree,
  listClassSubjects,
  getStudentsByTags,
  getTree,
};
