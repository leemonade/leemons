const { getByAsset } = require('./getByAsset');
const { tables } = require('../tables');

async function list(assetId, { userSession, transacting } = {}) {
  try {
    const { role: permissionRole } = await getByAsset(assetId, { userSession, transacting });

    if (permissionRole) {
      const entries = await tables.permissions.find(
        {
          asset: assetId,
        },
        { transacting }
      );

      return entries.map(({ role, userAgent }) => ({ role, userAgent }));
    }

    throw new Error("You don't have permission to list users");
  } catch (e) {
    throw new Error(`Failed to get permissions: ${e.message}`);
  }
}

module.exports = { list };
