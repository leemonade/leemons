const _ = require('lodash');

async function removeGroupByIds({ ids, soft, ctx }) {
  const groups = await ctx.tx.Groups.find({
    id: _.isArray(ids) ? ids : [ids],
    type: 'group',
  }).lean();
  await ctx.tx.emit('before-remove-groups', { groups, soft });
  await ctx.tx.db.Groups.deleteMany({ id: _.map(groups, 'id') }, { soft });
  await ctx.tx.emit('after-remove-groups', { groups, soft });
  return true;
}

module.exports = { removeGroupByIds };
