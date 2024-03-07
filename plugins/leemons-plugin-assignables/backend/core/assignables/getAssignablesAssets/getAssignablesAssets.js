/**
 * Get assets for given assignable ids
 * @async
 * @function getAssignablesAssets
 * @param {Object} params - The main parameter object.
 * @param {Array<string>} params.ids - The ids of the assignables.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} The assets by assignable id.
 */
async function getAssignablesAssets({ ids, ctx }) {
  const assignablesFound = await ctx.tx.db.Assignables.find({ id: ids })
    .select(['id', 'asset'])
    .lean();

  const assetsByAssignable = {};

  assignablesFound.forEach(({ id, asset }) => {
    assetsByAssignable[id] = asset;
  });

  return assetsByAssignable;
}

module.exports = { getAssignablesAssets };
