const _ = require('lodash');

async function removeGradeTag({ id, ctx }) {
  const gradeTags = await ctx.tx.db.GradeTags.find({ id: _.isArray(id) ? id : [id] }).lean();

  const gradeTagIds = _.map(gradeTags, 'id');

  await ctx.tx.emit('before-remove-grade-tags', { gradeTags });

  await ctx.tx.db.GradeTags.deleteMany({ id: gradeTagIds });

  await ctx.tx.emit('after-remove-grade-tags', { gradeTags });

  return true;
}

module.exports = { removeGradeTag };
