const { getByAsset: getPermissions } = require('../../permissions/getByAsset');
const { tables } = require('../../tables');

async function getByAsset(assetId, { userSession, checkPermissions = true, transacting } = {}) {
  try {
    if (checkPermissions) {
      // EN: Get the user permissions
      // ES: Obtener los permisos del usuario
      const { permissions } = await getPermissions(assetId, { userSession, transacting });

      // EN: Check if the user has permissions to view the asset
      // ES: Comprobar si el usuario tiene permisos para ver el asset
      if (!permissions.view) {
        return [];
      }
    }

    return tables.assetsFiles
      .find(
        {
          asset: assetId,
        },
        { transacting }
      )
      .then((files) => files.map((file) => file.file));
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get files: ${e.message}`);
  }
}

module.exports = { getByAsset };
