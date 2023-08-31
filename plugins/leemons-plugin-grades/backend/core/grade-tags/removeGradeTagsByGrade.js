const _ = require('lodash');
const { table } = require('../tables');

async function removeGradeTagsByGrade({ grade, ctx }) {
  const gradeTags = await ctx.tx.db.GradeTags.find({
    grade: _.isArray(grade) ? grade : [grade],
  }).lean();

  const gradeTagIds = _.map(gradeTags, 'id');

  await ctx.tx.emit('before-remove-grade-tags', { gradeTags });

  await table.gradeTags.deleteMany({ id: gradeTagIds });

  await ctx.tx.emit('after-remove-grade-tags', { gradeTags });

  return true;
}

module.exports = { removeGradeTagsByGrade };
