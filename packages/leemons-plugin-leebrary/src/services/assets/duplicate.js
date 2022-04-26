const { omit, isEmpty } = require('lodash');
const { getByAsset: getPermissions } = require('../permissions/getByAsset');
const { getByIds } = require('./getByIds');
const { add } = require('./add');
const { dataForReturnFile } = require('../files/dataForReturnFile');
const { getById: getCategory } = require('../categories/getById');

async function duplicate(assetId, { newId, userSession, transacting }) {
  // EN: Get the user permissions
  // ES: Obtener los permisos del usuario
  const { permissions } = await getPermissions(assetId, { userSession, transacting });

  // EN: Check if the user has permissions to update the asset
  // ES: Comprobar si el usuario tiene permisos para actualizar el activo
  if (!permissions.edit) {
    throw new global.utils.HttpError(401, "You don't have permissions to duplicate this asset");
  }

  const asset = (await getByIds(assetId, { withFiles: true, transacting }))[0];

  if (!asset) {
    throw new global.utils.HttpError(422, 'Asset not found');
  }

  const category = await getCategory(asset.category, { transacting });

  if (!category?.duplicable) {
    throw new global.utils.HttpError(401, 'Assets in this category cannot be duplicated');
  }

  const filesData = {};

  if (!isEmpty(asset.file?.id)) {
    filesData.file = await dataForReturnFile(asset.file.id);
  }

  if (!isEmpty(asset.cover?.id)) {
    filesData.cover = await dataForReturnFile(asset.cover.id);
  }

  const assetData = omit(asset, [
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
    { ...assetData, ...filesData, name: `${asset.name} (1)`, categoryId: asset.category },
    { newId, userSession, transacting }
  );

  return newAsset;
}

module.exports = { duplicate };
