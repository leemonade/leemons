const { tables } = require('../tables');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Construct the query object based on the assetId and userSession.
 * @param {string} assetId - The ID of the asset.
 * @param {Object} userSession - The user's session data.
 * @returns {Object} The constructed query object.
 */
function buildQuery(assetId, userSession) {
  const query = { asset: assetId };
  if (userSession?.userAgents) {
    query.userAgent = userSession.userAgents[0].id;
  }
  return query;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Get asset by assetId. If userSession is provided and has userAgents, it will also match the userAgent.
 * @param {string} assetId - The ID of the asset.
 * @param {Object} options - The options object.
 * @param {Array} options.columns - The columns to be returned in the result.
 * @param {Object} options.userSession - The user's session data.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise} Promise object represents the result of the query.
 */
async function getByAsset(assetId, { columns, userSession, transacting } = {}) {
  const query = buildQuery(assetId, userSession);
  return tables.pins.find(query, { columns, transacting });
}

module.exports = { getByAsset };
