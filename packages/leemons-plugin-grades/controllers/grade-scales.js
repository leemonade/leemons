const _ = require('lodash');
const gradesService = require('../src/services/grade-scales');

async function postGradeScale(ctx) {
  const gradeScale = await gradesService.addGradeScale(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, gradeScale };
}

async function putGradeScale(ctx) {
  const gradeScale = await gradesService.updateGradeScale(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, gradeScale };
}

module.exports = {
  putGradeScale,
  postGradeScale,
};
