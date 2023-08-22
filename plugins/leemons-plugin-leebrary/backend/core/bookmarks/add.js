const { isEmpty } = require('lodash');
const { uploadFromUrl: uploadFileFromUrl } = require('../files/upload');
const { validateAddBookmark } = require('../validations/forms');

/**
 * Adds a bookmark with the specified URL and icon URL to the given asset.
 *
 * @async
 * @function add
 * @param {Object} options - Input options.
 * @param {string} options.url - The URL of the bookmark.
 * @param {string} options.iconUrl - The URL of the icon for the bookmark.
 * @param {Object} options.asset - The asset to which the bookmark should be added.
 * @param {string} options.asset.id - The ID of the asset to which the bookmark should be added.
 * @param {import("moleculer").Context} options.ctx - The Moleculer request context.
 * @returns {Promise<Object>} A promise that resolves to the newly created bookmark object.
 * @throws {ValidationError} If the input data fails validation.
 */
async function add({ url, iconUrl, asset, ctx }) {
  await validateAddBookmark({ url, iconUrl, assetId: asset?.id });

  // ··········································································
  // UPLOAD ICON

  let icon;

  if (!isEmpty(iconUrl)) {
    try {
      // EN: Upload the file to the provider
      // ES: Subir el archivo al proveedor
      const iconFile = await uploadFileFromUrl({
        iconUrl,
        name: asset.name || 'icon',
      });

      icon = iconFile?.id;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('ERROR: downloading icon:', iconUrl);
      // eslint-disable-next-line no-console
      console.log('Despite the error, continue creating Asset ...');
    }
  }

  const bookmark = await ctx.tx.db.Bookmarks.create({ url, asset: asset.id, icon });
  return bookmark.toObject();
}

module.exports = { add };
