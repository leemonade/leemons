const { isEmpty } = require('lodash');
const { LeemonsError } = require('@leemons/error');

const { getByAsset } = require('../getByAsset');
const { remove: removeFiles } = require('../../files/remove/remove');

/**
 * Removes a bookmark from the database.
 *
 * @async
 * @function remove
 * @param {Object} params - The main parameter object.
 * @param {string} params.assetId - The ID of the asset associated with the bookmark.
 * @param {boolean} params.soft - Whether to soft delete the bookmark.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<object>} The result of the deletion operation.
 * @throws {LeemonsError} If the bookmark is not found or there is an error during deletion.
 */
async function remove({ assetId, soft, ctx }) {
  const bookmark = await getByAsset({ assetId, ctx });

  if (!bookmark) {
    throw new LeemonsError(ctx, { message: 'Bookmark not found', httpStatusCode: 404 });
  }

  try {
    const deleted = await ctx.tx.db.Bookmarks.deleteOne({ id: bookmark.id }, { soft });

    if (!isEmpty(bookmark.icon)) {
      await removeFiles({ fileIds: bookmark.icon, assetId, soft, ctx });
    }

    return deleted;
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to remove bookmark: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { remove };
