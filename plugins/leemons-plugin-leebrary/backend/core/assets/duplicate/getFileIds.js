const _ = require('lodash');
/**
 * Retrieves file IDs associated with a given asset.
 * It first checks if the asset has a cover and if so, adds the cover to the file IDs array.
 * Then, it fetches all asset files associated with the asset from the database and adds their IDs to the file IDs array.
 *
 * @summary Fetches file IDs associated with a given asset.
 * @param {Object} params - An object containing the parameters.
 * @param {Object} params.asset - The asset object.
 * @param {Moleculer.Context} params.ctx - The Moleculer context containing the transaction and other context data.
 * @returns {Promise<Array<string>>} - Returns a promise with an array of file IDs.
 */
async function getFileIds({ asset, ctx }) {
  const fileIds = [];

  if (asset.cover) {
    fileIds.push(asset.cover);
  }
  const assetFiles = await ctx.tx.db.AssetsFiles.find({ asset: asset.id }).lean();
  fileIds.push(..._.map(assetFiles, 'file'));

  return _.compact(_.uniq(fileIds));
}
module.exports = { getFileIds };
