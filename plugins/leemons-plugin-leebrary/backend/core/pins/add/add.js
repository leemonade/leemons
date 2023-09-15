const { LeemonsError } = require('@leemons/error');

const { exists: checkAssetExists } = require('../../assets/exists');
const { getByAsset: getPinByAsset } = require('../getByAsset');

/**
 * Adds a pin for a given asset.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {Context} params.ctx - The Moleculer context object.
 * @returns {Promise<LibraryPin>} A promise that resolves with the created pin document.
 * @throws {LeemonsError} If the asset ID is missing, the asset does not exist, or the asset is already pinned.
 */
async function add({ assetId, ctx }) {
  // Check if assetId is provided
  if (!assetId) {
    throw new LeemonsError(ctx, { message: 'Asset ID is required', httpStatusCode: 400 });
  }

  // Check if asset exists
  if (!(await checkAssetExists({ assetId, ctx }))) {
    throw new LeemonsError(ctx, { message: 'Asset does not exist', httpStatusCode: 400 });
  }

  // Check if asset is already pinned
  const pin = await getPinByAsset({ assetId, ctx });
  if (pin?.id) {
    throw new LeemonsError(ctx, { message: 'Asset already pinned', httpStatusCode: 400 });
  }

  // Create a new pin
  return ctx.tx.db.Pins.create({
    asset: assetId,
    userAgent: ctx.meta.userSession.userAgents[0].id,
  });
}

module.exports = { add };
