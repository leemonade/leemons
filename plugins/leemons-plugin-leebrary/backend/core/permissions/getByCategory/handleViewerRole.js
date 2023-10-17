const { forEach, findIndex } = require('lodash');
const getRolePermissions = require('../helpers/getRolePermissions');

/**
 * handleViewerRole is a function that handles the viewer role permissions.
 * It iterates over the viewItems and checks if the asset is included in the results and assetIds.
 * If not, it pushes a new object with the asset, role, and permissions into the results array.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.viewItems - The array of items to view.
 * @param {Array} params.results - The array of results.
 * @param {Array} params.assetIds - The array of asset IDs.
 * @param {MoleculerContext} params.ctx - The context object.
 * @returns {Array} - Returns an array of results with the viewer role permissions.
 */
function handleViewerRole({ viewItems, results, assetIds, ctx }) {
  forEach(viewItems, (asset) => {
    const index = findIndex(results, { asset });
    if (index < 0 && assetIds.includes(asset)) {
      results.push({
        asset,
        role: 'viewer',
        permissions: getRolePermissions({ role: 'viewer', ctx }),
      });
    }
  });

  return results;
}

module.exports = { handleViewerRole };
