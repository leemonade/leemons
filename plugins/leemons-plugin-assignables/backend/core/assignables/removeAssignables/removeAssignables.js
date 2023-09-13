const { uniq } = require('lodash');
const { updateAsset, getAsset } = require('../../leebrary/assets');
const { getAssignables } = require('../getAssignables');

async function removeAssignables({ ids, ctx }) {
  const assignables = getAssignables({ ids });

  // TODO: Include metadata.leebrary ids
  const assetIds = assignables.map((assignable) => assignable.asset?.id ?? assignable.asset);
  const resourcesIds = assignables.flatMap((assignable) => assignable.resources).filter(Boolean);

  const allAssetIds = uniq(assetIds.concat(resourcesIds));
  const assets = await getAsset({ id: allAssetIds, ctx });

  // Remove assets index-ability in order to  allow soft-delete without track
  await Promise.all(
    assets.map((asset) =>
      updateAsset({
        asset: { ...asset, indexable: false },
        upgrade: false,
        ctx,
      })
    )
  );

  const { modifiedCount } = await ctx.tx.db.Assignables.deleteMany(
    {
      id: { $in: ids },
    },
    {
      soft: true,
    }
  );
  return modifiedCount;
}

module.exports = {
  removeAssignables,
};
