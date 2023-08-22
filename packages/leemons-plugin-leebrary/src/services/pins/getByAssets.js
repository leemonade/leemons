const { flattenDeep } = require('lodash');
const { tables } = require('../tables');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Construct the query object based on the assetIds and userSession.
 * @param {Array} assetIds - The IDs of the assets.
 * @param {Object} userSession - The user's session data.
 * @returns {Object} The constructed query object.
 */
function buildQuery(assetIds, userSession) {
  const query = { asset_$in: assetIds };

  if (userSession?.userAgents) {
    query.userAgent = userSession.userAgents[0].id;
  }

  return query;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Get assets by assetIds. If userSession is provided and has userAgents, it will also match the userAgent.
 * @param {Array} assetIds - The IDs of the assets.
 * @param {Object} options - The options object.
 * @param {Array} options.columns - The columns to be returned in the result.
 * @param {Object} options.userSession - The user's session data.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Array>} The promise that resolves to an array of assets.
 */
async function getByAssets(assetIds, { columns, userSession, transacting } = {}) {
  const assetsIds = flattenDeep([assetIds]);
  const query = buildQuery(assetsIds, userSession);
  return tables.pins.find(query, { columns, transacting });
}

module.exports = { getByAssets };
