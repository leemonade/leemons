const { exists: fileExists } = require('../../files/exists');
const { exists: assetExists } = require('../exists');
const { tables } = require('../../tables');
const { getByAsset: getPermissions } = require('../../permissions/getByAsset');

async function add(fileId, assetId, { userSession, transacting } = {}) {
  try {
    // EN: Get the user permissions
    // ES: Obtener los permisos del usuario
    const { permissions } = await getPermissions(assetId, { userSession, transacting });

    // EN: Check if the user has permissions to update the asset
    // ES: Comprobar si el usuario tiene permisos para actualizar el activo
    if (!permissions.edit) {
      throw new Error("You don't have permissions to update this asset");
    }

    if (!(await fileExists(fileId, { transacting }))) {
      throw new Error('File not found');
    }

    if (!(await assetExists(assetId, { transacting }))) {
      throw new Error('Asset not found');
    }

    return tables.assetsFiles.set({ asset: assetId, file: fileId }, { transacting });
  } catch (e) {
    throw new Error(`Failed to add file: ${e.message}`);
  }
}

module.exports = { add };
