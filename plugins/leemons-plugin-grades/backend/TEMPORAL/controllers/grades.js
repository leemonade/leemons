const _ = require('lodash');
const gradesService = require('../src/services/grades');

async function postGrade(ctx) {
  const grade = await gradesService.addGrade(ctx.request.body, { fromFrontend: true });
  ctx.status = 200;
  ctx.body = { status: 200, grade };
}

async function putGrade(ctx) {
  const grade = await gradesService.updateGrade(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, grade };
}

async function getGrade(ctx) {
  const [grade] = await gradesService.gradeByIds(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200, grade };
}

async function haveGrades(ctx) {
  const have = await gradesService.haveGrades();
  ctx.status = 200;
  ctx.body = { status: 200, have };
}

async function removeGrade(ctx) {
  await gradesService.removeGrade(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200 };
}

async function listGrades(ctx) {
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
    const data = await gradesService.listGrades(parseInt(page, 10), parseInt(size, 10), center, {
      ...options,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

module.exports = {
  getGrade,
  putGrade,
  postGrade,
  haveGrades,
  listGrades,
  removeGrade,
};
