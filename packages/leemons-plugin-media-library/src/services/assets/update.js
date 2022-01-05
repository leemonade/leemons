const get = require('../permissions/get');
const { assets: table } = require('../tables');

module.exports = async function update(id, data, { userSession, transacting } = {}) {
  try {
    // EN: Get user's permissions
    // ES: Obtener los permisos del usuario
    const { permissions } = await get(id, { userSession, transacting });

    // EN: Check if the user has permissions to update the asset
    // ES: Comprobar si el usuario tiene permisos para actualizar el activo
    if (!permissions.edit) {
      throw new Error("You don't have permissions to update this asset");
    }

    const asset = {
      cover: data.cover,
      name: data.name,
      description: data.description,
    };

    // EN: Update the asset
    // ES: Actualizar el activo
    const item = await table.update({ id }, asset, { transacting });
    return item;
  } catch (e) {
    throw new Error(`Failed to update asset: ${e.message}`);
  }
};
