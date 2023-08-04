const _ = require('lodash');

async function removeByClass({ classIds, soft, ctx }) {
  const classSubstages = await ctx.tx.ClassSubstage.find({
    class: _.isArray(classIds) ? classIds : [classIds],
  }).lean();
  await ctx.tx.emit('before-remove-classes-substages', {
    classSubstages,
    soft,
  });
  await ctx.tx.db.ClassSubstage.deleteMany({ id: _.map(classSubstages, 'id') }, { soft });
  await ctx.tx.emit('after-remove-classes-substages', {
    classSubstages,
    soft,
  });
  return true;
}

module.exports = { removeByClass };
