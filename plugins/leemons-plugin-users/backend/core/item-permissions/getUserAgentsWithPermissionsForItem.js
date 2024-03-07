const { getItemPermissions } = require('./getItemPermissions');
const { findUserAgentsWithPermission } = require('../permissions/findUserAgentsWithPermission');

async function getUserAgentsWithPermissionsForItem({ item, type, ctx }) {
  const permissions = await getItemPermissions({ item, type, ctx });
  return findUserAgentsWithPermission({ permissions, ctx });
}

module.exports = { getUserAgentsWithPermissionsForItem };
