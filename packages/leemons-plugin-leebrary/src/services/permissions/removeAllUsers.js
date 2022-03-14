const { tables } = require('../tables');
const { getByAsset } = require('./getByAsset');

async function removeAllUsers(assetId, { userSession, transacting } = {}) {
  try {
    // EN: Get user role
    // ES: Obtener rol del usuario
    const { permissions } = await getByAsset(assetId, { userSession, transacting });

    if (!permissions.delete) {
      throw new global.utils.HttpError(401, "You don't have permission to remove this role");
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
    throw new global.utils.HttpError(500, `Failed to delete role: ${e.message}`);
  }
}

module.exports = { removeAllUsers };
