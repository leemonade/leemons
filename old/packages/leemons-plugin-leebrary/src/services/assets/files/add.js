const { exists: fileExists } = require('../../files/exists');
const { exists: assetExists } = require('../exists');
const { tables } = require('../../tables');
const { getByAsset: getPermissions } = require('../../permissions/getByAsset');

async function add(fileId, assetId, { skipPermissions, userSession, transacting } = {}) {
  try {
    // EN: Get the user permissions
    // ES: Obtener los permisos del usuario
    const { permissions } = await getPermissions(assetId, { userSession, transacting });

    // EN: Check if the user has permissions to update the asset
    // ES: Comprobar si el usuario tiene permisos para actualizar el activo
    if (!permissions.edit && !skipPermissions) {
      throw new global.utils.HttpError(401, "You don't have permissions to update this asset");
    }

    if (!(await fileExists(fileId, { transacting }))) {
      console.log('ERROR fileId:', fileId);
      throw new global.utils.HttpError(422, 'File not found');
    }

    if (!(await assetExists(assetId, { transacting }))) {
      throw new global.utils.HttpError(422, 'Asset not found');
    }

    return tables.assetsFiles.set(
      { asset: assetId, file: fileId },
      { asset: assetId, file: fileId },
      { transacting }
    );
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to add file: ${e.message}`);
  }
}

module.exports = { add };
