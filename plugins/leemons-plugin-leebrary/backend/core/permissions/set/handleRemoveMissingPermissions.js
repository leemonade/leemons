const { map, forEach, isNil, some, negate } = require('lodash');
const { removeMissingPermissions } = require('./removeMissingPermissions');
const { removeMissingUserAgents } = require('./removeMissingUserAgents');
const getAssetPermissionName = require('../helpers/getAssetPermissionName');

/**
 * This function handles the removal of missing permissions.
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.canAccess - The array of userAgents that can access the asset.
 * @param {Array} params.permissions - The permissions that should remain.
 * @param {Array} params.assetIds - The ids of the assets involved.
 * @param {Object} params.assetsRoleById - The roles of the assets by id.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<undefined>} - A promise that resolves when all missing permissions have been removed.
 */

async function handleRemoveMissingPermissions({
  canAccess,
  permissions,
  assetIds,
  assetsRoleById,
  ctx,
}) {
  const currentUserAgentIds = map(ctx.meta.userSession.userAgents, 'id');
  const toUpdate = map(canAccess, 'userAgent');

  const missingPromises = [];
  forEach(assetIds, (id) => {
    const assignerRole = assetsRoleById[id];
    const permissionName = getAssetPermissionName({ assetId: id, ctx });
    missingPromises.push(
      removeMissingUserAgents({
        id,
        toUpdate,
        assignerRole,
        permissionName,
        currentUserAgentIds,
        ctx,
      })
    );
    missingPromises.push(removeMissingPermissions({ id, permissions, assignerRole, ctx }));
  });
  if (some(missingPromises, negate(isNil))) await Promise.all(missingPromises);
}

module.exports = { handleRemoveMissingPermissions };
