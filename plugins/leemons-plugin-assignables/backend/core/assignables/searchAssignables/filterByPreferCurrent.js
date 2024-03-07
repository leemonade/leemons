const { find, forEach, groupBy, set, uniq } = require('lodash');
/**
 * Filters assignables based on the provided parameters.
 *
 * @param {Object} params - The parameters for filtering assignables.
 * @param {Array<Object>} params.assignablesIds - An array of objects, each containing the ID of an assignable to filter.
 * @param {boolean} params.published - Whether to only include published assignables.
 * @param {boolean} params.preferCurrent - Whether to prefer the current version of each assignable.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 *
 * @returns {Promise<Object<string, Array<Object>>>} - A promise that resolves to an object mapping UUIDs to arrays of assignables.
 */

async function filterByPreferCurrent({ assignablesIds, published, preferCurrent, ctx }) {
  const groupedAssignables = groupBy(assignablesIds, (id) => id.uuid);

  if (published !== false && preferCurrent) {
    const assignablesUuids = uniq(assignablesIds.map((id) => id.uuid));

    const currentVersions = await Promise.all(
      assignablesUuids.map(async (uuid) => {
        const { current } = await ctx.tx.call('common.versionControl.getCurrentVersion', {
          uuid,
        });

        return {
          uuid,
          current: await ctx.tx.call('common.versionControl.stringifyId', {
            id: uuid,
            version: current,
          }),
        };
      })
    );

    // EN: Get only the current versions (if not present, return all)
    // ES: Obtener solo las versiones actuales
    forEach(groupedAssignables, (values, uuid) => {
      const currentVersion = find(currentVersions, (version) => version.uuid === uuid);
      const current = find(values, (id) => id.fullId === currentVersion.current);
      if (current) {
        set(groupedAssignables, uuid, [current]);
      }

      return values;
    });
  }

  return groupedAssignables;
}

module.exports = { filterByPreferCurrent };
