/* eslint-disable no-param-reassign */
const { forEach, findIndex } = require('lodash');

const getRolePermissions = require('../helpers/getRolePermissions');

/**
 * handleAdminRole is a function that handles the admin role permissions.
 * It iterates over the adminItems and checks if the asset is included in the results.
 * If the asset is found and its role is 'viewer', it changes the role to 'admin' and updates the permissions.
 * If the asset is not found in the results but is included in the assetIds, it pushes a new object with the asset, role, and permissions into the results array.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.assignItems - The array of items with assigner permissions.
 * @param {Array} params.results - The array of results.
 * @param {Array} params.assetIds - The array of asset IDs.
 * @param {MoleculerContext} params.ctx - The context object.
 * @returns {Array} - Returns an array of results with the assigner role permissions.
 */
function handleAdminRole({ adminItems, results, assetIds, ctx }) {
  forEach(adminItems, (asset) => {
    const index = findIndex(results, { asset });
    if (index >= 0) {
      if (results[index].role === 'viewer') {
        results[index].role = 'admin';
        results[index].permissions = getRolePermissions({ role: 'admin', ctx });
      }
    } else if (assetIds.includes(asset)) {
      results.push({
        asset,
        role: 'admin',
        permissions: getRolePermissions({ role: 'admin', ctx }),
      });
    }
  });

  return results;
}

module.exports = { handleAdminRole };
