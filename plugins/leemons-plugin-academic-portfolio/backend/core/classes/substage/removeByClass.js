const _ = require('lodash');

async function removeByClass({ classIds, soft, ctx }) {
  const classSubstages = await ctx.tx.db.ClassSubstage.find({
    class: _.isArray(classIds) ? classIds : [classIds],
  }).lean();
  // NO ONE LISTENS TO THIS EVENT
  await ctx.tx.emit('before-remove-classes-substages', {
    classSubstages,
    soft,
  });
  await ctx.tx.db.ClassSubstage.deleteMany({ id: _.map(classSubstages, 'id') }, { soft });
  // NO ONE LISTENS TO THIS EVENT
  await ctx.tx.emit('after-remove-classes-substages', {
    classSubstages,
    soft,
  });
  return true;
}

module.exports = { removeByClass };
