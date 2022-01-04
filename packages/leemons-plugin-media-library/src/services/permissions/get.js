const { permissions } = require('../tables');
const isAssetOwner = require('./helpers/isAssetOwner');
const parsePermissions = require('./helpers/parsePermissions');

module.exports = async function get(asset, { userSession, transacting } = {}) {
  const userAgent =
    userSession.userAgents && userSession.userAgents.length ? userSession.userAgents[0].id : null;
  try {
    if (await isAssetOwner(asset, { userSession, transacting })) {
      return ['share', 'delete', 'edit', 'view'];
    }

    const [permission] = await permissions.find(
      {
        asset,
        userAgent,
      },
      { transacting }
    );

    return parsePermissions(permission?.permission || '');
  } catch (e) {
    throw new Error(`Failed to get permissions: ${e.message}`);
  }
};
