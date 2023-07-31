const { isEmpty } = require('lodash');
const { tables } = require('../tables');
const { getByAsset } = require('./getByAsset');
const { remove: removeFiles } = require('../files/remove');

async function remove(assetId, { soft, userSession, transacting } = {}) {
  const bookmark = await getByAsset(assetId, { transacting });

  if (!bookmark) {
    throw new global.utils.HttpError(404, 'Bookmark not found');
  }

  try {
    const deleted = await tables.bookmarks.delete({ id: bookmark.id }, { soft, transacting });

    if (!isEmpty(bookmark.icon)) {
      await removeFiles(bookmark.icon, assetId, { userSession, soft, transacting });
    }

    return deleted;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to remove bookmark: ${e.message}`);
  }
}

module.exports = { remove };
