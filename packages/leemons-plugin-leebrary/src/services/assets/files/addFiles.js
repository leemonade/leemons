const fileExists = require('../../files/exists');
const assetExists = require('../exists');
const { assetsFiles } = require('../../tables');
const get = require('../../permissions/get');

module.exports = async function addFiles(file, asset, { userSession, transacting } = {}) {
  try {
    // EN: Get the user permissions
    // ES: Obtener los permisos del usuario
    const { permissions } = await get(asset, { userSession, transacting });

    // EN: Check if the user has permissions to update the asset
    // ES: Comprobar si el usuario tiene permisos para actualizar el activo
    if (!permissions.edit) {
      throw new Error("You don't have permissions to update this asset");
    }

    if (!(await fileExists(file, { transacting }))) {
      throw new Error('File not found');
    }

    if (!(await assetExists(asset, { transacting }))) {
      throw new Error('Asset not found');
    }

    return assetsFiles.set({ asset, file }, { transacting });
  } catch (e) {
    throw new Error(`Failed to add file: ${e.message}`);
  }
};
