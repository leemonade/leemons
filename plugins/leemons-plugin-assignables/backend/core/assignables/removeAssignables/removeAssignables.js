const { uniq } = require('lodash');
const { updateAsset, getAsset } = require('../../leebrary/assets');
const { getAssignables } = require('../getAssignables');

/**
 * Removes assignables based on provided ids.
 * It fetches the assignables, maps their asset ids and resource ids,
 * and removes their index-ability to allow soft-delete without track.
 *
 * @async
 * @function removeAssignables
 * @param {Object} params - The main parameter object.
 * @param {Array<string>} params.ids - The ids of the assignables to remove.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<number>} The count of modified assignables.
 */
async function removeAssignables({ ids, ctx }) {
  const assignables = await getAssignables({ ids, ctx });

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
      id: ids,
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
