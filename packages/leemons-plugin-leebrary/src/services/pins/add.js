const { tables } = require('../tables');
const { exists: existsAsset } = require('../assets/exists');
const { getByAsset } = require('./getByAsset');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Validate the asset ID and user session.
 * @param {string} assetId - The ID of the asset.
 * @param {Object} userSession - The user's session data.
 * @param {Object} transacting - The transaction object.
 * @throws Will throw an error if the asset ID is not provided, the asset does not exist, or the asset is already pinned.
 */
async function validateAssetAndUserSession(assetId, userSession, transacting) {
  if (!assetId) {
    throw new global.utils.HttpError(400, 'Asset ID is required');
  }

  if (!(await existsAsset(assetId, { transacting }))) {
    throw new global.utils.HttpError(400, 'Asset does not exist');
  }

  const pin = await getByAsset(assetId, { userSession, transacting });

  if (pin?.id) {
    throw new global.utils.HttpError(400, 'Asset already pinned');
  }
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Add a new pin.
 * @param {string} assetId - The ID of the asset.
 * @param {Object} options - The options object.
 * @param {Object} options.userSession - The user's session data.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object>} Returns a promise that resolves to the result of the pin creation.
 */
async function add(assetId, { userSession, transacting: t } = {}) {
  await validateAssetAndUserSession(assetId, userSession, t);

  return global.utils.withTransaction(
    async (transacting) => {
      const result = await tables.pins.create(
        { asset: assetId, userAgent: userSession.userAgents[0].id },
        { transacting }
      );
      return result;
    },
    tables.pins,
    t
  );
}

module.exports = { add };
