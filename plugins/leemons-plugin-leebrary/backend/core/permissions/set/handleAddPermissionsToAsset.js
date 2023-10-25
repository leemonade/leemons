const _ = require('lodash');
const { addPermissionsToAsset } = require('./addPermissionsToAsset');

/**
 * This function handles the addition of permissions to an asset.
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.permissions - The permissions to be added.
 * @param {Array} params.assetIds - The ids of the assets.
 * @param {Object} params.assetsDataById - The data of the assets by id.
 * @param {Object} params.assetsRoleById - The roles of the assets by id.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<undefined>} - A promise that resolves when all permissions have been added.
 */

async function handleAddPermissionsToAsset({
  permissions,
  assetIds,
  assetsDataById,
  assetsRoleById,
  ctx,
}) {
  const assetPromises = [];
  _.forEach(assetIds, (id) => {
    const categoryId = assetsDataById[id]?.category;
    const assignerRole = assetsRoleById[id];
    assetPromises.push(
      addPermissionsToAsset({
        id,
        categoryId,
        permissions,
        assignerRole,
        ctx,
      })
    );
  });
  if (assetPromises.length) await Promise.all(assetPromises);
}

module.exports = { handleAddPermissionsToAsset };
