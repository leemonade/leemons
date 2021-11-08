const programService = require('../src/services/programs');

async function postProgram(ctx) {
  const program = await programService.addProgram(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, program };
}

async function listProgram(ctx) {
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
    const data = await programService.listPrograms(parseInt(page, 10), parseInt(size, 10), {
      ...options,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

async function detailProgram(ctx) {
  const [program] = await programService.programsByIds(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200, program };
}

module.exports = {
  postProgram,
  listProgram,
  detailProgram,
};
