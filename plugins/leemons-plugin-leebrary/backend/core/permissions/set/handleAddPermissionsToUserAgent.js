const _ = require('lodash');

const getAssetPermissionName = require('../helpers/getAssetPermissionName');

const { addPermissionsToUserAgent } = require('./addPermissionsToUserAgent');

/**
 * This function handles the addition of permissions to a user agent.
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.canAccess - The array of userAgents that can access the asset.
 * @param {Array} params.assetIds - The ids of the assets.
 * @param {Object} params.assetsDataById - The data of the assets by id.
 * @param {Object} params.assetsRoleById - The roles of the assets by id.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<undefined>} - A promise that resolves when all permissions have been added.
 */

async function handleAddPermissionsToUserAgent({
  canAccess,
  assetIds,
  assetsDataById,
  assetsRoleById,
  removeAllPermissionsFromPreviousOwner,
  ctx,
}) {
  const currentUserAgentIds = _.map(ctx.meta.userSession.userAgents, 'id');

  const userPromises = [];
  _.forEach(assetIds, (id) => {
    const categoryId = assetsDataById[id]?.category;
    const assignerRole = assetsRoleById[id];
    const permissionName = getAssetPermissionName({ assetId: id, ctx });
    _.forEach(canAccess, ({ userAgent, role }) => {
      if (!currentUserAgentIds.includes(userAgent)) {
        userPromises.push(
          addPermissionsToUserAgent({
            id,
            role,
            userAgent,
            categoryId,
            assignerRole,
            permissionName,
            removeAllPermissionsFromPreviousOwner,
            ctx,
          })
        );
      }
    });
  });

  if (userPromises.length) await Promise.all(userPromises);
}

module.exports = { handleAddPermissionsToUserAgent };
