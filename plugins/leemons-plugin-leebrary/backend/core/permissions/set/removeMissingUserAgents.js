const { forEach } = require('lodash');

const { removeMissingUserAgent } = require('./removeMissingUserAgent');

/**
 * This function removes missing user agents.
 * @param {Object} params - The parameters for the function.
 * @param {string} params.id - The id of the asset involved.
 * @param {Array} params.toUpdate - The array of userAgents that should be updated insted of removed.
 * @param {string} params.assignerRole - The role of the assigner.
 * @param {string} params.permissionName - The name of the permission.
 * @param {Array} params.currentUserAgentIds - The array of current user agent ids.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<undefined>} - A promise that resolves when all missing user agents have been removed.
 */

async function removeMissingUserAgents({
  id,
  toUpdate,
  assignerRole,
  permissionName,
  currentUserAgentIds,
  ctx,
}) {
  let toRemove = await ctx.tx.call('users.permissions.findUserAgentsWithPermission', {
    permissions: { permissionName },
  });
  toRemove = toRemove.filter((ua) => !toUpdate.includes(ua));

  const removePromises = [];
  forEach(toRemove, (userAgent) => {
    if (!currentUserAgentIds.includes(userAgent)) {
      removePromises.push(
        removeMissingUserAgent({
          id,
          userAgent,
          assignerRole,
          permissionName,
          ctx,
        })
      );
    }
  });
  if (removePromises.length) await Promise.all(removePromises);
}

module.exports = { removeMissingUserAgents };
