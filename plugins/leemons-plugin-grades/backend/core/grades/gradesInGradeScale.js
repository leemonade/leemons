const _ = require('lodash');

async function gradesInGradeScale({ gradeScale, ctx }) {
  return ctx.tx.db.Grades.countDocuments({
    minScaleToPromote: _.isArray(gradeScale) ? gradeScale : [gradeScale],
  });
}

module.exports = { gradesInGradeScale };
