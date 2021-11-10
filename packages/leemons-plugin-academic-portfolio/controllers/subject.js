const subjectService = require('../src/services/subjects');

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

async function listSubject(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
      program: { type: 'string' },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const { page, size, program, ...options } = ctx.request.query;
    const data = await subjectService.listSubjects(
      parseInt(page, 10),
      parseInt(size, 10),
      program,
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
  postSubject,
  putSubject,
  listSubject,
};
