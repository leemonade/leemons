/* eslint-disable no-param-reassign */
const { forEach, findIndex } = require('lodash');
const getRolePermissions = require('../helpers/getRolePermissions');

/**
 * handleEditorRole is a function that handles the editor role permissions.
 * It iterates over the editItems and checks if the asset is included in the results.
 * If the asset is found and its role is 'viewer', it changes the role to 'editor' and updates the permissions.
 * If the asset is not found in the results but is included in the assetIds, it pushes a new object with the asset, role, and permissions into the results array.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.editItems - The array of items to edit.
 * @param {Array} params.results - The array of results.
 * @param {Array} params.assetIds - The array of asset IDs.
 * @param {MoleculerContext} params.ctx - The context object.
 * @returns {Array} - Returns an array of results with the editor role permissions.
 */
function handleEditorRole({ editItems, results, assetIds, ctx }) {
  forEach(editItems, (asset) => {
    const index = findIndex(results, { asset });
    if (index >= 0) {
      if (results[index].role === 'viewer') {
        results[index].role = 'editor';
        results[index].permissions = getRolePermissions({ role: 'editor', ctx });
      }
    } else if (assetIds.includes(asset)) {
      results.push({
        asset,
        role: 'editor',
        permissions: getRolePermissions({ role: 'editor', ctx }),
      });
    }
  });

  return results;
}

module.exports = { handleEditorRole };
