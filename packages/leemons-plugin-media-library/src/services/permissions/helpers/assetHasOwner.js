const { permissions: table } = require('../../tables');

module.exports = async function assetHasOwner(asset, { transacting } = {}) {
  try {
    // EN: Get users with owner role
    // ES: Obtener usuarios con rol de propietario
    const owners = await table.count(
      {
        asset,
        role: 'owner',
      },
      { transacting }
    );

    return owners > 0;
  } catch (e) {
    throw new Error(`Failed to determine if asset has owner: ${e.message}`);
  }
};
