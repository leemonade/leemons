const { isEmpty, map, find, compact, uniq, isArray } = require('lodash');
const { find: findBookmarks } = require('../../bookmarks/find');
/* eslint-disable no-param-reassign */
/**
 * Fetches assets with files and bookmarks
 * @async
 * @param {Object} params - The params object
 * @param {Array} params.assets - The assets to fetch files for
 * @param {Array} params.assetsIds - The IDs of the assets
 * @param {MoleculerContext} params.ctx - The moleculer context
 * @returns {Promise<Array>} - Returns an array of assets with files and bookmarks
 */
async function getAssetsWithFiles({ assets, assetsIds, ctx }) {
  const assetsFiles = await ctx.tx.db.AssetsFiles.find({ asset: assetsIds }).lean();
  const fileIds = compact(
    uniq(map(assetsFiles, 'file').concat(assets.map((asset) => asset.cover)))
  );

  // ES: En caso de que algún asset sea un Bookmark, entonces recuperamos el icono
  // EN: In case one asset is a Bookmark, then we recover the icon
  const bookmarks = await findBookmarks({ query: { asset: assetsIds }, ctx });
  const iconFiles = compact(uniq(map(bookmarks, 'icon')));
  fileIds.push(...iconFiles);

  const files = await ctx.tx.db.Files.find({ id: fileIds }).lean();

  return assets.map((asset) => {
    if (asset.cover) {
      asset.cover = find(files, { id: asset.cover });
    }

    const bookmark = find(bookmarks, { asset: asset.id });
    if (bookmark) {
      asset.url = bookmark.url;
      asset.icon = find(files, { id: bookmark.icon });
      asset.fileType = 'bookmark';
      asset.mediaType = bookmark.mediaType ?? 'webpage';
      asset.metadata = [];
    }

    const items = assetsFiles
      .filter((assetFile) => assetFile.asset === asset.id)
      .map((assetFile) => find(files, { id: assetFile.file }));

    if (!isEmpty(items)) {
      if (asset.cover) {
        asset.file =
          items.length > 1 ? items.filter((item) => item.id !== asset.cover.id) : items[0];
      } else {
        [asset.file] = items;
      }
    }

    if (isArray(asset.file))
      [asset.file] = asset.file.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return asset;
  });
}
module.exports = { getAssetsWithFiles };
