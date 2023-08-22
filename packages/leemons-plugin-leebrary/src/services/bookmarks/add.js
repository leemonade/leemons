const { isEmpty } = require('lodash');
const { tables } = require('../tables');
const { uploadFromUrl: uploadFileFromUrl } = require('../files/upload');
const { validateAddBookmark } = require('../../validations/forms');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Uploads the icon file to the provider
 * @param {object} params - The params object
 * @param {string} params.iconUrl - The URL of the icon to be uploaded
 * @param {object} params.asset - The asset object
 * @param {object} params.transacting - The transaction object
 * @returns {Promise<string>} The ID of the uploaded icon file
 */
async function uploadIcon({ iconUrl, asset, transacting }) {
  let icon;
  if (!isEmpty(iconUrl)) {
    try {
      const iconFile = await uploadFileFromUrl(
        iconUrl,
        { name: asset.name || 'icon' },
        { transacting }
      );
      icon = iconFile?.id;
    } catch (e) {
      console.error('ERROR: downloading icon:', iconUrl);
      console.log('Despite the error, continue creating Asset ...');
    }
  }
  return icon;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Adds a bookmark
 * @param {object} bookmarkData - The bookmark data
 * @param {string} bookmarkData.url - The external URL to be bookmarked
 * @param {string} bookmarkData.iconUrl - The bookmarks's icon URL
 * @param {object} asset - The asset object
 * @param {object} options - The options object
 * @returns {Promise<object>} The created bookmark
 */
async function add({ url, iconUrl }, asset, { transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddBookmark({ url, iconUrl, assetId: asset?.id });

      const icon = await uploadIcon({ iconUrl, asset, transacting });

      const bookmark = await tables.bookmarks.create(
        { url, asset: asset.id, icon },
        { transacting }
      );
      return bookmark;
    },
    tables.bookmarks,
    t
  );
}

module.exports = { add };
