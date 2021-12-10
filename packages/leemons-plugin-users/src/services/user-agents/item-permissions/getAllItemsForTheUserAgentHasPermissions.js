const _ = require('lodash');
const { getBaseAllPermissionsQuery } = require('./getBaseAllPermissionsQuery');
const { find } = require('../../item-permissions/find');

async function getAllItemsForTheUserAgentHasPermissions(
  _userAgentId,
  { returnAllItemPermission, transacting } = {}
) {
  const query = await getBaseAllPermissionsQuery(_userAgentId, { transacting });

  const items = await find(query, {
    transacting,
  });

  if (returnAllItemPermission) return items;

  return _.uniq(_.map(items, 'item'));
}

module.exports = {
  getAllItemsForTheUserAgentHasPermissions,
};
