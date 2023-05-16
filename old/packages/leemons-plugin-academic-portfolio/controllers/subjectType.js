const subjectTypeService = require('../src/services/subject-type');

async function postSubjectType(ctx) {
  const subjectType = await subjectTypeService.addSubjectType(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, subjectType };
}

async function putSubjectType(ctx) {
  const subjectType = await subjectTypeService.updateSubjectType(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, subjectType };
}

async function listSubjectType(ctx) {
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
    const data = await subjectTypeService.listSubjectType(
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
  putSubjectType,
  postSubjectType,
  listSubjectType,
};
