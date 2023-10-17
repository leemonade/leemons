const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { rulesInGrade } = require('../rules/rulesInGrade');
const { removeGradeTagsByGrade } = require('../grade-tags/removeGradeTagsByGrade');
const { removeGradeScaleByGrade } = require('../grade-scales/removeGradeScaleByGrade');

async function removeGrade({ id, ctx }) {
  const nRulesInGrade = await rulesInGrade({ grade: id, ctx });
  if (nRulesInGrade)
    throw new LeemonsError(ctx, {
      message: 'Cannot remove grade with rules',
      httpStatusCode: 400,
      customCode: 6001,
    });

  const grades = await ctx.tx.db.Grades.find({ id: _.isArray(id) ? id : [id] }).lean();
  const gradeIds = _.map(grades, 'id');

  await ctx.tx.emit('before-remove-grades', { grades });

  await ctx.tx.db.Grades.updateMany({ id: gradeIds }, { minScaleToPromote: null });

  await removeGradeTagsByGrade({ grade: gradeIds, ctx });
  await removeGradeScaleByGrade({ grade: gradeIds, ctx });

  await ctx.tx.db.Grades.deleteMany({ id: gradeIds });

  await ctx.tx.emit('after-remove-grades', { grades });

  return true;
}

module.exports = { removeGrade };
