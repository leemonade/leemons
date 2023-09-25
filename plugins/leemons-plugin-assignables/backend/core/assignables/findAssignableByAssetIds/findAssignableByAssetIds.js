const { map } = require('lodash');
const { getAssignables } = require('../getAssignables');

/**
 * Find assignables by asset ids
 * @async
 * @function findAssignableByAssetIds
 * @param {Object} params - The main parameter object.
 * @param {Array<Object>} params.assets - The assets to find assignables for.
 * @param {boolean} params.deleted - Flag to include deleted assignables.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array<AssignablesAssignable>>} The found assignables.
 */
async function findAssignableByAssetIds({ assets, deleted, ctx }) {
  // EN: Get the details of each assignable (if no permissions, don't return it)
  // ES: Obtiene los detalles de cada asignable (si no tiene permisos, no lo devuelve)

  const assetIds = map(assets, 'id');
  const assignables = await getAssignables({
    ids: assetIds,
    columns: [],
    showDeleted: deleted,
    throwOnMissing: false,
    ctx,
  });

  return assignables;
}
module.exports = { findAssignableByAssetIds };
