const _ = require('lodash');

async function getGradeScalesByGrade({ grade, ctx }) {
  return ctx.tx.db.GradeScales.find({ grade: _.isArray(grade) ? grade : [grade] }).lean();
}

module.exports = { getGradeScalesByGrade };
