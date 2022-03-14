const { getByAsset: getPermissions } = require('../permissions/getByAsset');
const { tables } = require('../tables');

async function update(id, data, { userSession, transacting } = {}) {
  try {
    // EN: Get user's permissions
    // ES: Obtener los permisos del usuario
    const { permissions } = await getPermissions(id, { userSession, transacting });

    // EN: Check if the user has permissions to update the asset
    // ES: Comprobar si el usuario tiene permisos para actualizar el activo
    if (!permissions.edit) {
      throw new Error("You don't have permissions to update this asset");
    }

    // EN: Update the asset
    // ES: Actualizar el activo
    const asset = await tables.assets.update({ id }, data, { transacting });
    return asset;
  } catch (e) {
    throw new Error(`Failed to update asset: ${e.message}`);
  }
}

module.exports = { update };
