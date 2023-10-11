const { isArray } = require('lodash');

const { getByUser: getPinsByUser } = require('../../pins/getByUser');
/**
 * This function retrieves pinned assets based on the provided parameters.
 * If the 'pinned' parameter is true, it fetches the pins for the user and maps them to assets.
 * If no pins are found or 'pinned' parameter is false, it returns the assets as is.
 *
 * @param {Object} params - The parameters object.
 * @param {Array} params.assets - The initial array of assets.
 * @param {boolean} params.nothingFound - Flag to indicate if no assets were found.
 * @param {boolean} params.pinned - Flag to indicate if pinned assets should be retrieved.
 * @param {Object} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} - Returns an object containing the retrieved assets and a flag indicating if no assets were found.
 */

async function getPinnedAssets({
  assets: _assets = [],
  nothingFound: _nothingFound = false,
  pinned,
  ctx,
}) {
  let assets = _assets;
  let nothingFound = _nothingFound;

  if (pinned) {
    const pins = await getPinsByUser({ ctx });

    if (isArray(pins)) {
      assets = pins.map((pin) => pin.asset);
    } else {
      nothingFound = assets.length === 0;
    }
  }

  return { assets, nothingFound };
}

module.exports = { getPinnedAssets };
