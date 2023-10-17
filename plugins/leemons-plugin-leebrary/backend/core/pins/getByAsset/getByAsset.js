/**
 * Gets a pin by asset ID.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {string[]} params.columns - The columns to select.
 * @param {Context} params.ctx - The Moleculer context object.
 * @returns {Promise<LibraryPin>} A promise that resolves with the found pin document.
 */
async function getByAsset({ assetId, columns, ctx }) {
  const query = { asset: assetId };

  if (ctx.meta.userSession?.userAgents) {
    query.userAgent = ctx.meta.userSession.userAgents[0].id;
    return ctx.tx.db.Pins.findOne(query).select(columns).lean();
  }

  return ctx.tx.db.Pins.find(query).select(columns).lean();
}

module.exports = { getByAsset };
