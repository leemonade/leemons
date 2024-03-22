const _ = require('lodash');

async function removeSubjectTypeByIds({ ids, soft, ctx }) {
  const subjectTypes = await ctx.tx.db.SubjectTypes.find({ id: _.isArray(ids) ? ids : [ids] });
  await ctx.tx.emit('before-remove-subject-types', { subjectTypes, soft }); // possibly outdated - No plugin listens to it
  await ctx.tx.db.SubjectTypes.deleteMany({ id: _.map(subjectTypes, 'id') }, { soft });
  await ctx.tx.emit('after-remove-subject-types', { subjectTypes, soft }); // possibly outdated - No plugin listens to it
  return true;
}

module.exports = { removeSubjectTypeByIds };
