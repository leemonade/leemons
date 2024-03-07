/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { duplicate: duplicateFile } = require('../../files/duplicate');
/**
 * Handles the duplication of the bookmark associated with a given asset.
 * It duplicates the bookmark icon file and updates the new asset with the duplicated bookmark.
 *
 * @param {Object} params - An object containing the parameters
 * @param {Object} params.newAsset - The new asset object
 * @param {Object} params.bookmark - The bookmark object
 * @param {Array} params.filesToDuplicate - An array of file objects
 * @param {MoleculerContext} params.ctx - The moleculer context
 * @returns {Promise<Object>} - Returns a promise with the updated asset
 */
async function handleBookmarkDuplication({ newAsset, bookmark, filesToDuplicate, ctx }) {
  let newIconId = null;

  if (bookmark.icon) {
    const icon = _.find(filesToDuplicate, { id: bookmark.icon });
    const newIcon = await duplicateFile({ file: icon, ctx });
    newIconId = newIcon?.id;

    newAsset.url = bookmark.url;
    newAsset.icon = newIcon;
    newAsset.fileType = 'bookmark';
    newAsset.metadata = [];
  }

  await ctx.tx.db.Bookmarks.create({ url: bookmark.url, asset: newAsset.id, icon: newIconId });

  return newAsset;
}
module.exports = { handleBookmarkDuplication };
