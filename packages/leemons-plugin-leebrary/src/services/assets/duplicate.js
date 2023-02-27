const _ = require('lodash');
const { getByAsset: getPermissions } = require('../permissions/getByAsset');
const { getByAsset: getBookmark } = require('../bookmarks/getByAsset');
const { add } = require('./add');
const { getById: getCategory } = require('../categories/getById');
const { duplicate: duplicateFile } = require('../files/duplicate');
const { tables } = require('../tables');
const { add: addFiles } = require('./files/add');

async function duplicate(
  assetId,
  {
    preserveName = false,
    newId,
    indexable,
    public: isPublic,
    userSession,
    permissions: _permissions,
    transacting,
  }
) {
  // eslint-disable-next-line no-nested-ternary
  const pPermissions = _permissions
    ? _.isArray(_permissions)
      ? _permissions
      : [_permissions]
    : _permissions;
  // EN: Get the user permissions
  // ES: Obtener los permisos del usuario
  const { permissions } = await getPermissions(assetId, { userSession, transacting });

  // EN: Check if the user has permissions to update the asset
  // ES: Comprobar si el usuario tiene permisos para actualizar el activo
  if (!permissions.duplicate) {
    throw new global.utils.HttpError(401, "You don't have permissions to duplicate this asset");
  }

  const asset = await tables.assets.findOne({ id: assetId }, { transacting });
  if (!asset) throw new global.utils.HttpError(422, 'Asset not found');

  const category = await getCategory(asset.category, { transacting });

  if (!category?.duplicable) {
    throw new global.utils.HttpError(401, 'Assets in this category cannot be duplicated');
  }

  const fileIds = [];

  // ·········································································
  // BOOKMARK
  // ES: En caso de que el asset sea un Bookmark, entonces recuperamos los datos
  // EN: In case the asset is a Bookmark, then we recover the data
  const bookmark = await getBookmark(assetId, { transacting });

  if (bookmark) {
    asset.fileType = 'bookmark';
    asset.metadata = [];

    if (bookmark.icon) fileIds.push(bookmark.icon);
  }

  // ·········································································
  // FILES
  if (asset.cover) {
    // cover = await tables.files.findOne({ id: asset.cover }, { transacting });
    fileIds.push(asset.cover);
  }

  const assetFiles = await tables.assetsFiles.find({ asset: assetId }, { transacting });
  fileIds.push(..._.map(assetFiles, 'file'));

  const files = await tables.files.find({ id_$in: fileIds }, { transacting });

  const cover = _.find(files, { id: asset.cover });

  // ·········································································
  // TAGS
  const tagsService = leemons.getPlugin('common').services.tags;
  const [tags] = await tagsService.getValuesTags(assetId, {
    type: leemons.plugin.prefixPN(''),
    transacting,
  });

  // ·········································································
  // ASSET CREATION
  const assetData = _.omit(asset, [
    'id',
    'file',
    'cover',
    'icon',
    'category',
    'fromUser',
    'fromUserAgent',
    'created_at',
    'updated_at',
  ]);
  const newAsset = await add.call(
    this,
    {
      ...assetData,
      tags,
      name: ['true', true, 1, '1'].includes(preserveName) ? asset.name : `${asset.name} (1)`,
      categoryId: asset.category,
      permissions: pPermissions,
      indexable:
        indexable === undefined ? asset.indexable : ['true', true, 1, '1'].includes(indexable),
      public: isPublic === undefined ? asset.public : ['true', true, 1, '1'].includes(isPublic),
    },
    { newId, userSession, transacting, duplicating: true }
  );

  // ·········································································
  // POST CREATION

  if (cover) {
    const newCover = await duplicateFile(cover, { transacting });
    if (newCover) {
      await tables.assets.update({ id: newAsset.id }, { cover: newCover.id }, { transacting });
      newAsset.cover = newCover;
    }
  }

  if (bookmark) {
    let newIconId = null;

    if (bookmark.icon) {
      const icon = _.find(files, { id: bookmark.icon });
      const newIcon = await duplicateFile(icon, { transacting });
      newIconId = newIcon?.id;

      newAsset.url = bookmark.url;
      newAsset.icon = newIcon;
      newAsset.fileType = 'bookmark';
      newAsset.metadata = [];
    }

    await tables.bookmarks.create(
      { url: bookmark.url, asset: newAsset.id, icon: newIconId },
      { transacting }
    );
  }

  let newFiles = null;

  if (files.length) {
    const filesP = [];
    _.forEach(files, (file) => {
      // Skip cover duplication again
      if (file.id !== cover?.id) {
        filesP.push(duplicateFile(file, { transacting }));
      }
    });
    newFiles = await Promise.all(filesP);
    const promises = [];
    _.forEach(newFiles, (f) => {
      promises.push(
        addFiles(f.id, newAsset.id, {
          skipPermissions: true,
          userSession,
          transacting,
        })
      );
    });
    await Promise.allSettled(promises);
  }

  if (!_.isEmpty(newFiles)) {
    if (newAsset.cover) {
      newAsset.file =
        newFiles.length > 1
          ? newFiles.filter((item) => item.id !== newAsset.cover.id)
          : newFiles[0];
    } else {
      [newAsset.file] = newFiles;
    }
  }

  return newAsset;
}

module.exports = { duplicate };
