const _ = require('lodash');
const gradesService = require('../src/services/grades');

async function postGrade(ctx) {
  const grade = await gradesService.addGrade(ctx.request.body);
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

module.exports = {
  getGrade,
  putGrade,
  postGrade,
};
