const _ = require('lodash');
const { getByAsset: getPermissions } = require('../permissions/getByAsset');
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

  let cover = null;
  if (asset.cover) cover = await tables.files.findOne({ id: asset.cover }, { transacting });

  const assetFiles = await tables.assetsFiles.find({ asset: assetId }, { transacting });
  const files = await tables.files.find({ id_$in: _.map(assetFiles, 'file') }, { transacting });

  const category = await getCategory(asset.category, { transacting });

  if (!category?.duplicable) {
    throw new global.utils.HttpError(401, 'Assets in this category cannot be duplicated');
  }

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
      name: ['true', true, 1, '1'].includes(preserveName) ? asset.name : `${asset.name} (1)`,
      categoryId: asset.category,
      permissions: pPermissions,
      indexable:
        indexable === undefined ? asset.indexable : ['true', true, 1, '1'].includes(indexable),
      public: isPublic === undefined ? asset.public : ['true', true, 1, '1'].includes(isPublic),
    },
    { newId, userSession, transacting }
  );

  if (cover) {
    const coverFile = await duplicateFile(cover, { transacting });
    if (coverFile)
      await tables.assets.update({ id: newAsset.id }, { cover: coverFile.id }, { transacting });
  }

  if (files.length) {
    const filesP = [];
    _.forEach(files, (file) => {
      filesP.push(duplicateFile(file, { transacting }));
    });
    const filesR = await Promise.all(filesP);
    const promises = [];
    _.forEach(filesR, (f) => {
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

  return newAsset;
}

module.exports = { duplicate };
