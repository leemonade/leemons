const { map, uniq } = require('lodash');

/**
 * Retrieves the assignables matching the given assignable instance IDs.
 *
 * @param {Object} options - The options for retrieving the assignables.
 * @param {Array} options.assignableInstancesIds - The IDs of the assignable instances.
 * @param {MoleculerContext} options.ctx - The Moleculer context object.
 * @returns {Array} An array of assignables matching the assignable instance IDs, including additional properties from the matching instances.
 */
async function getAssignables({ assignableInstancesIds, ctx }) {
  const assignablesMatching = await ctx.tx.db.Instances.find({
    id: assignableInstancesIds,
  })
    .select(['assignable', 'id'])
    .lean();

  const assignablesIds = uniq(map(assignablesMatching, 'assignable'));

  const assignablesFound = await ctx.tx.db.Assignables.find({
    id: assignablesIds,
  })
    .select(['id', 'asset', 'role'])
    .lean();

  return assignablesMatching.map((instance) => ({
    ...assignablesFound.find((assignable) => assignable.id === instance.assignable),
    ...instance,
  }));
}

module.exports = {
  getAssignables,
};
