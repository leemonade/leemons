const {
  isAdminUpdatingCenterAsset: isAdminUpdatingCenterAssetFunction,
} = require('../../permissions/centerAssetItemPermission');
const {
  addCenterItemPermission,
} = require('../../permissions/centerAssetItemPermission/addCenterItemPermission');
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
async function handleAssetUpgrade({ assetId, currentAsset, scale, published, subjects, ctx }) {
  const { fullId } = await ctx.tx.call('common.versionControl.upgradeVersion', {
    id: assetId,
    upgrade: scale,
    published,
  });

  const isAdminUpdatingCenterAsset = await isAdminUpdatingCenterAssetFunction({
    asset: currentAsset,
    ctx,
  });

  const duplicatedAsset = await duplicate({
    assetId,
    preserveName: true,
    newId: fullId,
    preserveOwner: isAdminUpdatingCenterAsset,
    ctx,
  });

  if (isAdminUpdatingCenterAsset) {
    const [ownerUserAgentDetails] = await ctx.tx.call('users.users.getUserAgentsInfo', {
      userAgentIds: [duplicatedAsset.fromUserAgent],
      withCenter: true,
      withProfile: true,
      ctx,
    });
    await addCenterItemPermission({
      assetId: duplicatedAsset.id,
      centerId: ownerUserAgentDetails.center.id,
      ctx,
    });
  }

  if (subjects?.length) {
    await Promise.all(
      subjects.map((item) =>
        ctx.tx.db.AssetsSubjects.create({ asset: duplicatedAsset.id, subject: item })
      )
    );
  }

  return duplicatedAsset;
}

module.exports = { handleAssetUpgrade };
