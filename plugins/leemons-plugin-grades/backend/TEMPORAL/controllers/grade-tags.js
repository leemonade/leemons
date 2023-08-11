const _ = require('lodash');
const gradesService = require('../src/services/grade-tags');

async function postGradeTag(ctx) {
  const gradeTag = await gradesService.addGradeTag(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, gradeTag };
}

async function putGradeTag(ctx) {
  const gradeTag = await gradesService.updateGradeTag(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, gradeTag };
}

async function removeGradeTag(ctx) {
  await gradesService.removeGradeTag(ctx.request.params.id);
  ctx.status = 200;
  ctx.body = { status: 200 };
}

module.exports = {
  putGradeTag,
  postGradeTag,
  removeGradeTag,
};
