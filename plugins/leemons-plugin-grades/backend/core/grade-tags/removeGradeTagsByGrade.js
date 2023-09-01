const _ = require('lodash');

async function removeGradeTagsByGrade({ grade, ctx }) {
  const gradeTags = await ctx.tx.db.GradeTags.find({
    grade: _.isArray(grade) ? grade : [grade],
  }).lean();

  const gradeTagIds = _.map(gradeTags, 'id');

  await ctx.tx.emit('before-remove-grade-tags', { gradeTags });

  await ctx.tx.db.GradeTags.deleteMany({ id: gradeTagIds });

  await ctx.tx.emit('after-remove-grade-tags', { gradeTags });

  return true;
}

module.exports = { removeGradeTagsByGrade };
