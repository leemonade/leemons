const _ = require('lodash');

async function removeByClass({ classIds, soft, ctx }) {
  const classGroups = await ctx.tx.db.ClassGroup.find({
    class: _.isArray(classIds) ? classIds : [classIds],
  }).lean();
  await ctx.tx.emit('before-remove-classes-groups', { classGroups, soft });
  await ctx.tx.db.ClassGroup.deleteMany({ id: _.map(classGroups, 'id') }, { soft });
  await ctx.tx.emit('after-remove-classes-groups', { classGroups, soft });
  return true;
}

module.exports = { removeByClass };
