/**
 * Gets the pins by the asset IDs.
 *
 * @param {Object} params - The parameters object.
 * @param {string[]} params.assetsIds - The asset IDs.
 * @param {string[]} params.columns - The columns to select.
 * @param {Context} params.ctx - The Moleculer context object.
 * @returns {Promise<LibraryPin[]>} A promise that resolves with the found pin documents.
 */
const { flattenDeep } = require('lodash');

async function getByAssets({ assetsIds, columns, ctx }) {
  const assets = flattenDeep([assetsIds]);

  const query = { asset: assets };

  const userAgents = ctx.meta.userSession?.userAgents;

  if (userAgents) {
    query.userAgent = userAgents[0].id;
  }

  return ctx.tx.db.Pins.find(query).select(columns).lean();
}

module.exports = { getByAssets };
