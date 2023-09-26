const { find, findIndex } = require('lodash');
/**
 * Sorts the assignables based on the provided sorting criteria
 * @function sortAssignables
 * @param {Array<Object>} sorting - The sorting criteria.
 * @param {Array<Object>} _assignablesIds - The ids of the assignables to be sorted.
 * @param {Array<string>} assets - The assets related to the assignables.
 * @returns {Array<string>} The sorted ids of the assignables.
 */

function sortAssignables(sorting, _assignablesIds, assets) {
  let assignablesIds = _assignablesIds;
  if (sorting) {
    if (find(sorting, { key: 'name' })) {
      assignablesIds = assignablesIds.map((assignable) => {
        const asset = findIndex(assets, (a) => a === assignable.asset);

        let position;
        if (asset > -1) {
          position = asset;
        } else {
          position = Math.max();
        }

        return {
          ...assignable,
          position,
        };
      });

      assignablesIds = assignablesIds.sort((a, b) => a.position - b.position);
    }
  }
  return assignablesIds.map(({ id }) => id);
}

module.exports = { sortAssignables };
