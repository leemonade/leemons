const { tables } = require('../tables');
const { getByAsset } = require('./getByAsset');

async function removeAllUsers(assetId, { userSession, transacting } = {}) {
  try {
    // EN: Get user role
    // ES: Obtener rol del usuario
    const { permissions } = await getByAsset(assetId, { userSession, transacting });

    if (!permissions.delete) {
      throw new Error("You don't have permission to remove this role");
    }

    // EN: Remove all the users
    // ES: Eliminar todos los usuarios
    return await tables.permissions.deleteMany(
      {
        asset: assetId,
      },
      { transacting }
    );
  } catch (e) {
    throw new Error(`Failed to delete role: ${e.message}`);
  }
}

module.exports = { removeAllUsers };
