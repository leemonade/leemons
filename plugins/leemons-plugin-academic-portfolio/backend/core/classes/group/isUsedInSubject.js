const _ = require('lodash');

async function isUsedInSubject({ subject, group, classe, ctx }) {
  const classes = await ctx.tx.db.Class.find({ subject }).select(['id']).lean();
  const query = {
    class: _.map(classes, 'id'),
    group,
  };
  if (classe) {
    const index = query.class.indexOf(classe);
    if (index !== -1) {
      query.class.splice(index, 1);
    }
  }
  const result = await ctx.tx.db.ClassGroup.countDocuments(query);
  return !!result;
}

module.exports = { isUsedInSubject };
