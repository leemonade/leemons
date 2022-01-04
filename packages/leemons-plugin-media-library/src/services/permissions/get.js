const { permissions } = require('../tables');
const getRolePermissions = require('./helpers/getRolePermissions');

module.exports = async function get(asset, { userSession, transacting } = {}) {
  const userAgent =
    userSession.userAgents && userSession.userAgents.length ? userSession.userAgents[0].id : null;
  try {
    const [permission] = await permissions.find(
      {
        asset,
        userAgent,
      },
      { transacting }
    );

    return getRolePermissions(permission?.role);
  } catch (e) {
    throw new Error(`Failed to get permissions: ${e.message}`);
  }
};
