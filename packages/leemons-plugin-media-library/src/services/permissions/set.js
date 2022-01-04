const { permissions: table } = require('../tables');
const isAssetOwner = require('./helpers/isAssetOwner');
const stringifyPermissions = require('./helpers/stringifyPermissions');

module.exports = async function set(asset, permissions, { userSession, transacting } = {}) {
  const userAgent =
    userSession.userAgents && userSession.userAgents.length ? userSession.userAgents[0].id : null;
  try {
    if (await isAssetOwner(asset, { userSession, transacting })) {
      return true;
    }

    await table.set(
      {
        asset,
        userAgent,
      },
      {
        permission: stringifyPermissions(permissions),
      },
      { transacting }
    );

    return true;
  } catch (e) {
    throw new Error(`Failed to set permissions: ${e.message}`);
  }
};
