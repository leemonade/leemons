const _ = require('lodash');

async function removeByClass({ classIds, soft, ctx }) {
  const classKnowledges = await ctx.tx.db.ClassKnowledges.find({
    class: _.isArray(classIds) ? classIds : [classIds],
  }).lean();
  await ctx.tx.emit('before-remove-classes-knowledges', {
    classKnowledges,
    soft,
  });

  await ctx.tx.db.ClassKnowledges.deleteMany({ id: _.map(classKnowledges, 'id') }, { soft });
  await ctx.tx.emit('after-remove-classes-knowledges', {
    classKnowledges,
    soft,
  });
  return true;
}

module.exports = { removeByClass };
