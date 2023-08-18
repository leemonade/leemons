const _ = require('lodash');

async function removeSubjectTypeByIds({ ids, soft, ctx }) {
  const subjectTypes = await ctx.tx.SubjectTypes.find({ id: _.isArray(ids) ? ids : [ids] });
  await ctx.tx.emit('before-remove-subject-types', { subjectTypes, soft });
  await ctx.tx.db.SubjectTypes.deleteMany({ id: _.map(subjectTypes, 'id') }, { soft });
  await ctx.tx.emit('after-remove-subject-types', { subjectTypes, soft });
  return true;
}

module.exports = { removeSubjectTypeByIds };
