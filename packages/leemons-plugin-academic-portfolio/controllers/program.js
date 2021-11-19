const programService = require('../src/services/programs');

async function postProgram(ctx) {
  const program = await programService.addProgram(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, program };
}

async function putProgram(ctx) {
  const program = await programService.updateProgram(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, program };
}

async function listProgram(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
      center: { type: ['string'] },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const { page, size, center, ...options } = ctx.request.query;
    const data = await programService.listPrograms(parseInt(page, 10), parseInt(size, 10), center, {
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
  if (!program) throw new Error('Program not found');
  ctx.status = 200;
  ctx.body = { status: 200, program };
}

async function programHasCourses(ctx) {
  const courses = await programService.getProgramCourses(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200, has: courses.length > 0 };
}

async function programHasGroups(ctx) {
  const groups = await programService.getProgramGroups(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200, has: groups.length > 0 };
}

async function programHasSubstages(ctx) {
  const substages = await programService.getProgramSubstages(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200, has: substages.length > 0 };
}

async function programCourses(ctx) {
  const courses = await programService.getProgramCourses(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200, courses };
}

async function programGroups(ctx) {
  const groups = await programService.getProgramGroups(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200, groups };
}

async function programSubstages(ctx) {
  const substages = await programService.getProgramSubstages(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200, substages };
}

async function deleteProgram(ctx) {
  await programService.removeProgramByIds(ctx.request.params.id, { soft: ctx.request.query.soft });
  ctx.status = 200;
  ctx.body = { status: 200 };
}

async function duplicateProgram(ctx) {
  const [program] = await programService.duplicateProgramByIds(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200, program };
}

module.exports = {
  putProgram,
  postProgram,
  listProgram,
  detailProgram,
  programGroups,
  deleteProgram,
  programCourses,
  programHasGroups,
  duplicateProgram,
  programSubstages,
  programHasCourses,
  programHasSubstages,
};
