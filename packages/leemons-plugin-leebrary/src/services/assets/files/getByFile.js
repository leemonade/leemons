const { compact, uniq } = require('lodash');
const { getByAsset: getPermissions } = require('../../permissions/getByAsset');
const { find: findAssets } = require('../find');
const { find: findBookmarks } = require('../../bookmarks/find');
const { tables } = require('../../tables');

async function getByFile(
  fileId,
  { checkPermissions = true, onlyPublic, userSession, transacting } = {}
) {
  try {
    const promises = [
      // ES: Buscamos en las relaciones entre archivos y assets
      // EN: Search in the relations between files and assets
      tables.assetsFiles.find({ file: fileId }, { transacting }),
      // ES: Buscamos los assets que tengan el archivo como cover
      // EN: Search the assets that have the file as cover
      findAssets({ cover: fileId }, { transacting }),
      // ES: Buscamos los bookmarks que tengan el archivo como icon
      // EN: Search the bookmarks that have the file as icon
      findBookmarks({ icon: fileId }, { transacting }),
    ];

    const result = await Promise.all(promises);
    const assetsIds = compact(
      uniq(
        result[0]
          .map((item) => item.asset)
          .concat(result[1].map((item) => item.id))
          .concat(result[2].map((item) => item.asset))
      )
    );

    const assetId = assetsIds[0];

    if (onlyPublic) {
      const [asset] = await findAssets({ id: assetId }, { transacting });
      if (!asset?.public) {
        return null;
      }
    }

    if (checkPermissions) {
      // EN: Get the user permissions
      // ES: Obtener los permisos del usuario
      const { permissions } = await getPermissions(assetId, { userSession, transacting });

      // EN: Check if the user has permissions to view the asset
      // ES: Comprobar si el usuario tiene permisos para ver el asset
      if (!permissions.view) {
        return null;
      }
    }

    return assetId;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get files: ${e.message}`);
  }
}

module.exports = { getByFile };
