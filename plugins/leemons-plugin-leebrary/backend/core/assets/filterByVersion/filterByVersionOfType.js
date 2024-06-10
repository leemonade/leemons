const { uniq, intersection } = require('lodash');

async function filterByVersionOfType({ assetIds, categoryId, ctx, ...options }) {
  try {
    const filteredAssets = await ctx.tx.call('common.versionControl.listVersionsOfType', {
      type: ctx.prefixPN(categoryId),
      ...options,
    });

    return uniq(
      intersection(
        assetIds,
        filteredAssets.map((item) => item.fullId)
      )
    );
  } catch (e) {
    ctx.logger.error(`Failed to list asset versions of category with id ${categoryId}`, e);
  }
  return assetIds;
}

module.exports = { filterByVersionOfType };
