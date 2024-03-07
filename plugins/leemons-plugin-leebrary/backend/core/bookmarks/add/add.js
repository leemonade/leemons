const { isEmpty } = require('lodash');
const { uploadFromUrl: uploadFileFromUrl } = require('../../files/upload');
const { validateAddBookmark } = require('../../validations/forms');

/**
 * Adds a bookmark to the database.
 *
 * @async
 * @function add
 * @param {Object} params - The main parameter object.
 * @param {string} params.url - The URL of the bookmark.
 * @param {string} params.iconUrl - The URL of the icon for the bookmark.
 * @param {Object} params.asset - The asset associated with the bookmark.
 * @param {string} params.mediaType - The media type of the bookmark.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<object>} The created bookmark.
 * @throws {Error} If there is an error downloading the icon.
 */
async function add({ url, mediaType, iconUrl, asset, ctx }) {
  await validateAddBookmark({ url, iconUrl, assetId: asset?.id });

  // ··········································································
  // UPLOAD ICON

  let icon;

  if (!isEmpty(iconUrl)) {
    try {
      // EN: Upload the file to the provider
      // ES: Subir el archivo al proveedor
      const iconFile = await uploadFileFromUrl({ url: iconUrl, name: asset.name || 'icon', ctx });

      icon = iconFile?.id;
    } catch (e) {
      ctx.logger.error('ERROR: downloading icon:', iconUrl);
      ctx.logger.debug('Despite the error, continue creating Asset ...');
    }
  }

  return ctx.tx.db.Bookmarks.create({ url, mediaType, asset: asset.id, icon });
}

module.exports = { add };
