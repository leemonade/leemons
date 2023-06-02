const _ = require('lodash');
const { table } = require('../tables');
const { getItemPermissions } = require('./getItemPermissions');
const { findUserAgentsWithPermission } = require('../permissions/findUserAgentsWithPermission');

async function getUserAgentsWithPermissionsForItem(item, type, { transacting } = {}) {
  const permissions = await getItemPermissions(item, type, { transacting });
  return findUserAgentsWithPermission(permissions, { transacting });
}

module.exports = { getUserAgentsWithPermissionsForItem };
