const { intersection, uniq } = require('lodash');
const getAssetIdFromPermissionName = require('../helpers/getAssetIdFromPermissionName');
const { filterByVersionOfType } = require('../../assets/filterByVersion');

/**
 * This function handles the asset IDs by concatenating all IDs and then getting the intersection in accordance with their status.
 * @param {Object} param - The parameters object.
 * @param {Array} param.permissions - The permissions array.
 * @param {Array} param.publicAssets - The public assets array.
 * @param {Array} param.viewItems - The view items array.
 * @param {Array} param.editItems - The edit items array.
 * @param {String} param.categoryId - The category ID.
 * @param {Boolean} param.published - The published status.
 * @param {Boolean} param.preferCurrent - The prefer current status.
 * @param {MoleculerContext} param.ctx - The context object.
 * @returns {Promise<Array<String>>} - Returns the unique asset IDs after intersection.
 */
async function handleAssetIds({
  permissions,
  publicAssets,
  viewItems,
  editItems,
  assignItems,
  categoryId,
  published,
  preferCurrent,
  ctx,
}) {
  // ES: Concatenamos todas las IDs, y luego obtenemos la intersección en función de su status
  // EN: Concatenate all IDs, and then get the intersection in accordance with their status
  let assetIds = uniq(
    permissions
      .map((item) => getAssetIdFromPermissionName(item.permissionName))
      .concat(publicAssets.map((item) => item.asset))
      .concat(viewItems)
      .concat(editItems)
      .concat(assignItems)
  );

  try {
    assetIds = await filterByVersionOfType({ assetIds, categoryId, ctx, published, preferCurrent });
  } catch (e) {
    ctx.logger.error(`Failed to get asset by status from categoryId ${categoryId}`);
  }

  return assetIds;
}

module.exports = { handleAssetIds };
