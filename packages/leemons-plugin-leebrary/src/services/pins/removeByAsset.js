const { tables } = require('../tables');
const { getByAsset } = require('./getByAsset');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Delete a pin.
 * @param {Object} pin - The pin to delete.
 * @param {Object} options - The options object.
 * @param {boolean} options.soft - If true, perform a soft delete.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object>} The promise that resolves to the deleted pin.
 * @throws {HttpError} If the deletion fails.
 */
async function deletePin(pin, { soft, transacting } = {}) {
  try {
    return await tables.pins.delete({ id: pin.id }, { soft, transacting });
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to remove Pin: ${e.message}`);
  }
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Delete a pin by its assetId.
 * @param {string} assetId - The ID of the asset.
 * @param {Object} options - The options object.
 * @param {boolean} options.soft - If true, perform a soft delete.
 * @param {Object} options.userSession - The user's session data.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object>} The promise that resolves to the deleted pin.
 * @throws {HttpError} If the pin is not found or the deletion fails.
 */
async function removeByAsset(assetId, { soft, userSession, transacting } = {}) {
  const pin = await getByAsset(assetId, { userSession, transacting });

  if (!pin) {
    throw new global.utils.HttpError(404, 'Pin not found');
  }

  return deletePin(pin, { soft, transacting });
}

module.exports = { removeByAsset };
