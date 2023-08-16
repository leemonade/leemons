const _ = require('lodash');

async function removeSubstageByIds({ ids, soft, ctx }) {
  const substages = await ctx.tx.db.Groups.find({
    id: _.isArray(ids) ? ids : [ids],
    type: 'substage',
  }).lean();
  await ctx.tx.emit('before-remove-substages', { substages, soft });
  await ctx.tx.db.Groups.deleteMany({ id: _.map(substages, 'id') }, { soft });
  await ctx.tx.emit('after-remove-substages', { substages, soft });
  return true;
}

module.exports = { removeSubstageByIds };
