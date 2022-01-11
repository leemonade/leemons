const { permissions, assets } = require('../tables');
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

    if (!permission) {
      const _asset = await assets.find({ id: asset }, { columns: ['public'], transacting });
      if (_asset[0]?.public) {
        return {
          role: 'public',
          permissions: getRolePermissions('public'),
        };
      }
    }

    return { role: permission?.role, permissions: getRolePermissions(permission?.role) };
  } catch (e) {
    throw new Error(`Failed to get permissions: ${e.message}`);
  }
};
