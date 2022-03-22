const { tables } = require('../../tables');

module.exports = async function assetHasOwner(assetId, { transacting } = {}) {
  try {
    // EN: Get users with owner role
    // ES: Obtener usuarios con rol de propietario
    const owners = await tables.permissions.count(
      {
        asset: assetId,
        role: 'owner',
      },
      { transacting }
    );

    return owners > 0;
  } catch (e) {
    throw new global.utils.HttpError(412, `Failed to determine if asset has owner: ${e.message}`);
  }
};
