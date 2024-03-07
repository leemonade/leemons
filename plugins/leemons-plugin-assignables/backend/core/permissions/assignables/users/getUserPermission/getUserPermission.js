const { getUserPermissions } = require('../getUserPermissions');

/**
 * Retrieves the user permissions based on the assignable ID and context.
 *
 * @param {Object} options - The options for retrieving the user permissions.
 * @param {string} options.assignableId - The ID of the assignable.
 * @param {MoleculerContext} options.ctx - The Moleculer context.
 * @return {Promise<Object>} A promise that resolves to an object containing the user's role and actions.
 */
async function getUserPermission({ assignableId, ctx }) {
  const assignable = await ctx.tx.db.Assignables.findOne({ id: assignableId })
    .select({
      id: 1,
      asset: 1,
    })
    .lean();

  const permissions = await getUserPermissions({ assignables: [assignable], ctx });

  return permissions[assignableId] ?? { role: 'viewer', actions: ['view'] };
}

module.exports = { getUserPermission };
