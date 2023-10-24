const { duplicate } = require('../duplicate');

/**
 * Handles the asset version upgrade if the current version is published.
 *
 * @param {object} params - The params object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {string} params.scale - The scale of the upgrade.
 * @param {boolean} params.published - A flag indicating whether the asset is published.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<object>} The duplicated asset.
 */
async function handleAssetUpgrade({ assetId, scale, published, ctx }) {
  const { fullId } = await ctx.tx.call('common.versionControl.upgradeVersion', {
    id: assetId,
    upgrade: scale,
    published,
  });

  return duplicate({ assetId, preserveName: true, newId: fullId, ctx });
}

module.exports = { handleAssetUpgrade };
