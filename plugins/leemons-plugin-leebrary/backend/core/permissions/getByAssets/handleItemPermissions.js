/**
 * This asynchronous function handles the permissions for each item. It retrieves the permissions for each user agent
 * for each permission type ('asset.can-view', 'asset.can-edit', 'asset.can-assign') and returns the responses.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.assetsIds - The list of asset IDs.
 * @param {Array} params.userAgents - The list of user agents.
 * @param {Object} params.transacting - The transaction object.
 * @returns {Promise<Array>} An array containing the responses for each permission type for each user agent.
 */
async function handleItemPermissions({ assetsIds, userAgents, ctx }) {
  const permissionTypes = ['asset.can-view', 'asset.can-edit', 'asset.can-assign'];

  return Promise.all(
    permissionTypes.map((type) =>
      ctx.tx.call('users.permissions.getAllItemsForTheUserAgentHasPermissionsByType', {
        userAgentId: userAgents,
        type: ctx.prefixPN(type),
        ignoreOriginalTarget: true,
        item: assetsIds,
      })
    )
  );
}

module.exports = { handleItemPermissions };
