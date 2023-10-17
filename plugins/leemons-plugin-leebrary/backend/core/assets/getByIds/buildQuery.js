const { isNil } = require('lodash');
/**
 * Builds a query object based on the provided asset IDs and indexable flag.
 * @param {Object} params - The params object
 * @param {Array<string>} params.assetsIds - The IDs of the assets to include in the query.
 * @param {boolean} params.indexable - Flag to filter assets based on their indexable property.
 * @returns {Object} - Returns a query object.
 */
function buildQuery({ assetsIds, indexable }) {
  const query = {
    id: assetsIds,
  };

  if (!isNil(indexable)) {
    query.indexable = indexable;
  }

  return query;
}

module.exports = { buildQuery };
