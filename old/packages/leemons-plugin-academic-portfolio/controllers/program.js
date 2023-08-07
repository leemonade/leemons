const _ = require('lodash');
const programService = require('../src/services/programs');

async function getProgramTree(ctx) {
  const tree = await programService.getProgramTree(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200, tree };
}

async function havePrograms(ctx) {
  const have = await programService.havePrograms();
  ctx.status = 200;
  ctx.body = { status: 200, have };
}

async function postProgram(ctx) {
  const data = JSON.parse(ctx.request.body.data);
  _.forIn(ctx.request.files, (value, key) => {
    _.set(data, key, value);
  });
  const program = await programService.addProgram(data, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, program };
}

async function putProgram(ctx) {
  const data = JSON.parse(ctx.request.body.data);
  _.forIn(ctx.request.files, (value, key) => {
    _.set(data, key, value);
  });
  const program = await programService.updateProgram(data, { userSession: ctx.state.userSession });
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
      userSession: ctx.state.userSession,
      ...options,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

async function detailProgram(ctx) {
  const [program] = await programService.programsByIds(ctx.request.params.id, {
    userSession: ctx.state.userSession,
  });
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
  await programService.removeProgramByIds(ctx.request.params.id, {
    soft: ctx.request.query.soft === 'true',
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200 };
}

async function duplicateProgram(ctx) {
  const [program] = await programService.duplicateProgramByIds(ctx.request.params.id, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, program };
}

async function addStudentsToClassesUnderNodeTree(ctx) {
  const data = await programService.addStudentsToClassesUnderNodeTree(
    ctx.request.body.program,
    ctx.request.body.nodeType,
    ctx.request.body.nodeId,
    ctx.request.body.students
  );
  ctx.status = 200;
  ctx.body = { status: 200, data };
}

async function getUserPrograms(ctx) {
  const programs = await programService.getUserPrograms(ctx.state.userSession);
  ctx.status = 200;
  ctx.body = { status: 200, programs };
}

async function getProgramEvaluationSystem(ctx) {
  const evaluationSystem = await programService.getProgramEvaluationSystem(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200, evaluationSystem };
}

module.exports = {
  putProgram,
  postProgram,
  listProgram,
  havePrograms,
  detailProgram,
  programGroups,
  deleteProgram,
  programCourses,
  getProgramTree,
  getUserPrograms,
  programHasGroups,
  duplicateProgram,
  programSubstages,
  programHasCourses,
  programHasSubstages,
  getProgramEvaluationSystem,
  addStudentsToClassesUnderNodeTree,
};
