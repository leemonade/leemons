const { getByAsset: getPermissions } = require('../../permissions/getByAsset');
const { tables } = require('../../tables');

async function unlink(fileIds, assetId, { userSession, soft, transacting } = {}) {
  try {
    // EN: Get the user permissions
    // ES: Obtener los permisos del usuario
    const { permissions } = await getPermissions(assetId, { userSession, transacting });

    // EN: Check if the user has permissions to delete the asset
    // ES: Comprobar si el usuario tiene permisos para eliminar el asset
    if (!permissions.delete) {
      throw new global.utils.HttpError(401, "You don't have permissions to delete this asset");
    }

    const query = {
      file_$in: Array.isArray(fileIds) ? fileIds : [fileIds],
    };

    if (assetId) {
      query.asset = assetId;
    }

    const deleted = await tables.assetsFiles.deleteMany(query, { soft, transacting });

    return deleted.count > 0;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to delete file: ${e.message}`);
  }
}

module.exports = { unlink };
