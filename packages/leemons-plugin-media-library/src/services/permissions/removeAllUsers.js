const { permissions: table } = require('../tables');
const getRole = require('./get');

module.exports = async function removeAllUsers(asset, { userSession, transacting } = {}) {
  try {
    // EN: Get user role
    // ES: Obtener rol del usuario
    const { permissions } = await getRole(asset, { userSession, transacting });

    if (!permissions.delete) {
      throw new Error("You don't have permission to remove this role");
    }

    // EN: Remove all the users
    // ES: Eliminar todos los usuarios
    return await table.deleteMany(
      {
        asset,
      },
      { transacting }
    );
  } catch (e) {
    throw new Error(`Failed to delete role: ${e.message}`);
  }
};
