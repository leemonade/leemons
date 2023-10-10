/* eslint-disable no-param-reassign */
const { forEach, findIndex } = require('lodash');
const getRolePermissions = require('../helpers/getRolePermissions');

/**
 * handleEditorRole is a function that handles the assigner role permissions.
 * It iterates over the assignItems and checks if the asset is included in the results.
 * If the asset is found and its role is 'viewer', it changes the role to 'assigner' and updates the permissions.
 * If the asset is not found in the results but is included in the assetIds, it pushes a new object with the asset, role, and permissions into the results array.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.assignItems - The array of items with assigner permissions.
 * @param {Array} params.results - The array of results.
 * @param {Array} params.assetIds - The array of asset IDs.
 * @param {MoleculerContext} params.ctx - The context object.
 * @returns {Array} - Returns an array of results with the assigner role permissions.
 */
function handleAssignerRole({ assignItems, results, assetIds, ctx }) {
  forEach(assignItems, (asset) => {
    const index = findIndex(results, { asset });
    if (index >= 0) {
      if (results[index].role === 'viewer') {
        results[index].role = 'assigner';
        results[index].permissions = getRolePermissions({ role: 'assigner', ctx });
      }
    } else if (assetIds.includes(asset)) {
      results.push({
        asset,
        role: 'assigner',
        permissions: getRolePermissions({ role: 'assigner', ctx }),
      });
    }
  });

  return results;
}

module.exports = { handleAssignerRole };
