const { isArray } = require('lodash');

/**
 * Get the files associated with multiple files
 *
 * @param {Array|string} fileIds - The IDs of the files
 * @param {MoleculerContext} ctx - The Moleculer context
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of files
 */
async function getByFiles({ fileIds, ctx }) {
  const ids = isArray(fileIds) ? fileIds : [fileIds];
  return ctx.tx.db.AssetsFiles.find({ file: ids }).lean();
}

module.exports = { getByFiles };
