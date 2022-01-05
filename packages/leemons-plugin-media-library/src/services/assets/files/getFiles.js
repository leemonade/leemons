const get = require('../../permissions/get');
const { assetsFiles } = require('../../tables');

module.exports = function getFiles(asset, { userSession, transacting } = {}) {
  // EN: Get the user permissions
  // ES: Obtener los permisos del usuario
  const { permissions } = get(asset, { userSession, transacting });

  // EN: Check if the user has permissions to view the asset
  // ES: Comprobar si el usuario tiene permisos para ver el asset
  if (!permissions.view) {
    return [];
  }

  return assetsFiles
    .find(
      {
        asset,
      },
      { transacting }
    )
    .then((files) => files.map((file) => file.file));
};
