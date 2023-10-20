const { uniq, map } = require('lodash');
const { getAssetsData } = require('./getAssetsData');

async function getAssignablesData({ assignables, ctx }) {
  const uniqAssignables = uniq(assignables);

  const assignablesObj = {};

  const assignablesData = await ctx.tx.db.Assignables.find({
    id: uniqAssignables,
  })
    .select(['asset', 'id', 'role'])
    .lean();

  const assetsIds = map(assignablesData, 'asset');
  const assetsData = await getAssetsData({ assets: assetsIds, ctx });

  assignablesData.forEach((assignable) => {
    assignablesObj[assignable.id] = { ...assignable, asset: assetsData[assignable.asset] };
  });

  return assignablesObj;
}

module.exports = { getAssignablesData };
