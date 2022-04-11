const subjectService = require('../src/services/subjects');
const {
  validatePutSubjectCredits,
  validateGetSubjectCredits,
  validateGetSubjectCreditsProgram,
} = require('../src/validations/forms');

async function postSubject(ctx) {
  const subject = await subjectService.addSubject(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, subject };
}

async function putSubject(ctx) {
  const subject = await subjectService.updateSubject(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, subject };
}

async function putSubjectCredits(ctx) {
  validatePutSubjectCredits(ctx.request.body);
  const { subject, program, credits } = ctx.request.body;
  const subjectCredits = await subjectService.setSubjectCredits(subject, program, credits);
  ctx.status = 200;
  ctx.body = { status: 200, subjectCredits };
}

async function getSubjectCredits(ctx) {
  validateGetSubjectCredits(ctx.request.query);
  const { subject, program } = ctx.request.query;
  const subjectCredits = await subjectService.getSubjectCredits(subject, program);
  ctx.status = 200;
  ctx.body = { status: 200, subjectCredits };
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
  const { id } = ctx.request.params;
  const data = await subjectService.subjectByIds([id]);
  ctx.status = 200;
  ctx.body = { status: 200, data: data && data[0] };
}

module.exports = {
  postSubject,
  putSubject,
  listSubject,
  putSubjectCredits,
  getSubjectCredits,
  listSubjectCreditsForProgram,
  subjectByIds,
};
