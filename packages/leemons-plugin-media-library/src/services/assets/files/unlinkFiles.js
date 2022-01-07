const get = require('../../permissions/get');
const { assetsFiles } = require('../../tables');

module.exports = async function unlinkFiles(files, asset, { userSession, transacting } = {}) {
  try {
    // EN: Get the user permissions
    // ES: Obtener los permisos del usuario
    const { permissions } = await get(asset, { userSession, transacting });

    // EN: Check if the user has permissions to delete the asset
    // ES: Comprobar si el usuario tiene permisos para eliminar el asset
    if (!permissions.delete) {
      throw new Error("You don't have permissions to delete this asset");
    }

    const query = {
      file_$in: Array.isArray(files) ? files : [files],
    };

    if (asset) {
      query.asset = asset;
    }

    const deleted = await assetsFiles.deleteMany(query, { transacting });

    return deleted.count > 0;
  } catch (e) {
    throw new Error(`Failed to delete file: ${e.message}`);
  }
};
