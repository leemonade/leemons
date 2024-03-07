const _ = require('lodash');
async function removeGradeScaleByGrade({ grade, ctx }) {
  const gradeScales = await ctx.tx.db.GradeScales.find({
    grade: _.isArray(grade) ? grade : [grade],
  }).lean();

  const gradeScaleIds = _.map(gradeScales, 'id');

  await ctx.tx.emit('before-remove-grade-scales', { gradeScales });

  await ctx.tx.db.GradeScales.deleteMany({ id: gradeScaleIds });

  await ctx.tx.emit('after-remove-grade-scales', { gradeScales });

  return true;
}

module.exports = { removeGradeScaleByGrade };
