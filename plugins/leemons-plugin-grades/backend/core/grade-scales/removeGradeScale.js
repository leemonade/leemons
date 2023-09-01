const _ = require('lodash');
const { canRemoveGradeScale } = require('./canRemoveGradeScale');

async function removeGradeScale({ id, ctx }) {
  const gradeScales = await ctx.tx.db.GradeScales.find({ id: _.isArray(id) ? id : [id] }).lean();

  const gradeScaleIds = _.map(gradeScales, 'id');

  await canRemoveGradeScale({ id: gradeScaleIds, ctx });

  await ctx.tx.emit('before-remove-grade-scales', { gradeScales });

  await ctx.tx.db.GradeScales.deleteMany({ id: gradeScaleIds });

  await ctx.tx.emit('after-remove-grade-scales', { gradeScales });

  return true;
}

module.exports = { removeGradeScale };
