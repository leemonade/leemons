const { isEmpty } = require('lodash');
const { tables } = require('../tables');
const { uploadFromUrl: uploadFileFromUrl } = require('../files/upload');
const { validateAddBookmark } = require('../../validations/forms');

async function add({ url, iconUrl }, asset, { transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddBookmark({ url, iconUrl, assetId: asset?.id });

      // ··········································································
      // UPLOAD ICON

      let icon;

      if (!isEmpty(iconUrl)) {
        // EN: Upload the file to the provider
        // ES: Subir el archivo al proveedor
        const iconFile = await uploadFileFromUrl(
          iconUrl,
          { name: asset.name || 'icon' },
          { transacting }
        );

        icon = iconFile.id;
      }

      const bookmark = await tables.bookmarks.create(
        { url, asset: asset.id, icon },
        { transacting }
      );
      // console.log('-- BOOKMARK --');
      // console.dir(bookmark, { depth: null });
      return bookmark;
    },
    tables.bookmarks,
    t
  );
}

module.exports = { add };
