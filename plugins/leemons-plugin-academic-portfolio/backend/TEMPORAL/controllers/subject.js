const _ = require('lodash');
const subjectService = require('../src/services/subjects');
const {
  validatePutSubjectCredits,
  validateGetSubjectCredits,
  validateGetSubjectCreditsProgram,
  validateGetSubjectsCredits,
} = require('../src/validations/forms');

async function postSubject(ctx) {
  const data = JSON.parse(ctx.request.body.data);
  _.forIn(ctx.request.files, (value, key) => {
    _.set(data, key, value);
  });
  const subject = await subjectService.addSubject(data, { userSession: ctx.state.userSession });
  ctx.status = 200;
  ctx.body = { status: 200, subject };
}

async function putSubject(ctx) {
  const data = JSON.parse(ctx.request.body.data);
  _.forIn(ctx.request.files, (value, key) => {
    _.set(data, key, value);
  });
  const subject = await subjectService.updateSubject(data, { userSession: ctx.state.userSession });
  ctx.status = 200;
  ctx.body = { status: 200, subject };
}

async function deleteSubject(ctx) {
  await subjectService.deleteSubjectWithClasses(ctx.request.params.id, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200 };
}

async function putSubjectCredits(ctx) {
  validatePutSubjectCredits(ctx.request.body);
  const { subject, program, credits } = ctx.request.body;
  const subjectCredits = await subjectService.setSubjectCredits(subject, program, credits);
  ctx.status = 200;
  ctx.body = { status: 200, subjectCredits };
}

async function getSubjectCredits(ctx) {
  let { subjects } = ctx.request.query;
  if (subjects) {
    subjects = JSON.parse(subjects);

    validateGetSubjectsCredits(subjects);
    const subjectsCredits = await subjectService.getSubjectsCredits(subjects);
    ctx.status = 200;
    ctx.body = { status: 200, subjectsCredits };
  } else {
    validateGetSubjectCredits(ctx.request.query);
    const { subject, program } = ctx.request.query;
    const subjectCredits = await subjectService.getSubjectCredits(subject, program);
    ctx.status = 200;
    ctx.body = { status: 200, subjectCredits };
  }
}

async function listSubjectCreditsForProgram(ctx) {
  validateGetSubjectCreditsProgram(ctx.request.query);
  const { program } = ctx.request.query;
  const subjectCredits = await subjectService.listSubjectCreditsForProgram(program);
  ctx.status = 200;
  ctx.body = { status: 200, subjectCredits };
}

async function listSubject(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
      program: { type: 'string' },
      course: { type: 'string' },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const { page, size, program, course, ...options } = ctx.request.query;
    const data = await subjectService.listSubjects(
      parseInt(page, 10),
      parseInt(size, 10),
      program,
      course,
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

async function subjectByIds(ctx) {
  let { id } = ctx.request.params;
  if (!id) {
    const { ids } = ctx.request.query;
    id = JSON.parse(ids);
  }

  // console.log(id);

  const data = await subjectService.subjectByIds(Array.isArray(id) ? id : [id], {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  if (ctx.request.params.id) {
    ctx.body = { status: 200, data: data && data[0] };
  } else {
    ctx.body = { status: 200, data };
  }
}

module.exports = {
  postSubject,
  putSubject,
  listSubject,
  putSubjectCredits,
  getSubjectCredits,
  listSubjectCreditsForProgram,
  subjectByIds,
  deleteSubject,
};
