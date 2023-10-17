const { compact, uniq } = require('lodash');
const { find: findBookmarks } = require('../../../bookmarks/find');
const { find: findAssets } = require('../../find');
/**
 * Fetches the assets and bookmarks related to a file.
 *
 * @param {object} params - The params object.
 * @param {string} params.fileId - The ID of the file.
 * @param {MoleculerContext} params.ctx - The Moleculer context object.
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of assets and related bookmark assets IDs.
 */
async function getRelatedAssets({ fileId, ctx }) {
  const promises = [
    // ES: Buscamos en las relaciones entre archivos y assets
    // EN: Search in the relations between files and assets
    ctx.tx.db.AssetsFiles.find({ file: fileId }).lean(),
    // ES: Buscamos los assets que tengan el archivo como cover
    // EN: Search the assets that have the file as cover
    findAssets({ query: { cover: fileId }, ctx }),
    // ES: Buscamos los bookmarks que tengan el archivo como icon
    // EN: Search the bookmarks that have the file as icon
    findBookmarks({ query: { icon: fileId }, ctx }),
  ];

  const result = await Promise.all(promises);
  return compact(
    uniq(
      result[0]
        .map((item) => item.asset)
        .concat(result[1].map((item) => item.id))
        .concat(result[2].map((item) => item.asset))
    )
  );
}
module.exports = { getRelatedAssets };
