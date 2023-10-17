const { escapeRegExp } = require('lodash');
/**
 * handlePermissions is an asynchronous function that fetches permissions for a specific category.
 * It makes three different calls to fetch permissions related to the user and the category.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.categoryId - The ID of the category for which permissions are to be fetched.
 * @param {MoleculerContext} params.ctx - The context object.
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of permissions.
 */
async function handlePermissions({ userSession, categoryId, ctx }) {
  const usersService = 'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType';
  return Promise.all([
    ctx.tx.call('users.permissions.getUserAgentPermissions', {
      userAgent: userSession.userAgents,
      query: {
        permissionName: { $regex: `^${escapeRegExp(ctx.prefixPN(''))}` },
        target: categoryId,
      },
    }),
    ctx.tx.call(usersService, {
      userAgentId: userSession.userAgents,
      type: ctx.prefixPN('asset.can-view'),
      ignoreOriginalTarget: true,
      target: categoryId,
    }),
    ctx.tx.call(usersService, {
      userAgentId: userSession.userAgents,
      type: ctx.prefixPN('asset.can-edit'),
      ignoreOriginalTarget: true,
      target: categoryId,
    }),
    ctx.tx.call(usersService, {
      userAgentId: userSession.userAgents,
      type: ctx.prefixPN('asset.can-assign'),
      ignoreOriginalTarget: true,
      target: categoryId,
    }),
  ]);
}

module.exports = { handlePermissions };
