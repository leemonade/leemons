/* eslint-disable no-param-reassign */
const { isEmpty, flatten, map, find, compact, uniq } = require('lodash');
const { tables } = require('../tables');
const { getByAssets: getPermissions } = require('../permissions/getByAssets');
const { getUsersByAsset } = require('../permissions/getUsersByAsset');
const { find: findBookmarks } = require('../bookmarks/find');
const canAssignRole = require('../permissions/helpers/canAssignRole');
const { getByIds: getCategories } = require('../categories/getByIds');

async function getByIds(
  assetsIds,
  {
    withFiles,
    withTags = true,
    withCategory = true,
    checkPermissions,
    userSession,
    showPublic,
    transacting,
  } = {}
) {
  const ids = flatten([assetsIds]);
  let assets = await tables.assets.find({ id_$in: ids }, { transacting });

  // ·········································································
  // PERMISSIONS & PERSONS

  if (checkPermissions && userSession) {
    const permissions = await getPermissions(assetsIds, { showPublic, userSession, transacting });
    const privateAssets = permissions.map((item) => item.asset);
    assets = assets.filter((asset) => privateAssets.includes(asset.id));

    for (let i = 0, l = assets.length; i < l; i++) {
      const asset = assets[i];
      const permission = permissions.find((item) => item.asset === asset.id);
      if (!isEmpty(permission?.permissions)) {
        const { role: userRole, permissions: userPermissions } = permission;
        if (userPermissions.edit) {
          // eslint-disable-next-line no-await-in-loop
          let assetPermissions = await getUsersByAsset(asset.id, { userSession });
          assetPermissions = assetPermissions.map((user) => {
            const item = { ...user };
            item.editable = canAssignRole(userRole, item.permissions[0], item.permissions[0]);
            return item;
          });
          assets[i].canAccess = assetPermissions;
        }
      }
    }
  }

  // ·········································································
  // FILES

  if (!isEmpty(assets) && withFiles) {
    const assetsFiles = await tables.assetsFiles.find({ asset_$in: ids }, { transacting });
    const fileIds = compact(
      uniq(map(assetsFiles, 'file').concat(assets.map((asset) => asset.cover)))
    );

    // ES: En caso de que algún asset sea un Bookmark, entonces recuperamos el icono
    // EN: In case one asset is a Bookmark, then we recover the icon
    const bookmarks = await findBookmarks({ asset_$in: ids }, { transacting });
    const iconFiles = compact(uniq(map(bookmarks, 'icon')));
    fileIds.push(...iconFiles);

    const files = await tables.files.find({ id_$in: fileIds }, { transacting });
    assets = assets.map((asset) => {
      const items = assetsFiles
        .filter((assetFile) => assetFile.asset === asset.id)
        .map((assetFile) => find(files, { id: assetFile.file }));

      if (asset.cover) {
        asset.cover = find(files, { id: asset.cover });
      }

      const bookmark = find(bookmarks, { asset: asset.id });

      if (bookmark) {
        asset.url = bookmark.url;
        asset.icon = find(files, { id: bookmark.icon });
        asset.fileType = 'bookmark';
        asset.metadata = [];
      }

      if (!isEmpty(items)) {
        if (asset.cover) {
          asset.file =
            items.length > 1 ? items.filter((item) => item.id !== asset.cover) : items[0];
        } else {
          [asset.file] = items;
        }
      }

      return asset;
    });
  }

  // ·········································································
  // TAGS
  let tags = [];

  if (withTags) {
    const tagsService = leemons.getPlugin('common').services.tags;
    tags = await Promise.all(
      assets.map((item) =>
        tagsService.getValuesTags(item.id, { type: leemons.plugin.prefixPN(''), transacting })
      )
    );
  }

  // ·········································································
  // CATEGORY DATA
  let categories = [];
  let assetCategoryData = [];

  if (withCategory) {
    categories = await getCategories(uniq(assets.map((item) => item.category)), {
      transacting,
    });

    // CATEGORY ROVIDER DATA
    const providersResults = await Promise.all(
      categories.map((category) => {
        if (category.provider === 'leebrary') {
          return null;
        }

        const categoryProvider = category.provider;
        const assetProviderService = leemons.getProvider(categoryProvider).services.assets;
        return assetProviderService.getByIds(
          assets.filter((item) => item.category === category.id),
          { userSession, transacting }
        );
      })
    );

    assetCategoryData = providersResults.flat();
  }

  return assets.map((asset, index) => {
    const item = { ...asset };

    if (withCategory) {
      const { duplicable, assignable } = find(categories, { id: asset.category });
      item.duplicable = duplicable;
      item.assignable = assignable;
      item.providerData = find(assetCategoryData, { asset: asset.id });
    }

    if (withTags) {
      [item.tags] = tags[index];
    }

    return item;
  });
}

module.exports = { getByIds };
