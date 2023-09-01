const _ = require('lodash');

async function removeConditionsByRule({ ids, ctx }) {
  const conditions = await ctx.tx.db.Conditions.find({ rule: _.isArray(ids) ? ids : [ids] }).lean();
  const conditionIds = _.map(conditions, 'id');
  await ctx.tx.emit('before-remove-conditions', { conditions });
  await ctx.tx.db.Conditions.deleteMany({ id: conditionIds });
  await ctx.tx.emit('after-remove-conditions', { conditions });
  return true;
}

module.exports = { removeConditionsByRule };
