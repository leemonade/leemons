const _ = require('lodash');
const { getBaseAllPermissionsQuery } = require('./getBaseAllPermissionsQuery');
const { find } = require('../../item-permissions/find');

async function getAllItemsForTheUserAgentHasPermissionsByType(
  _userAgentId,
  _type,
  // eslint-disable-next-line camelcase
  { returnAllItemPermission, type_$startssWith, transacting } = {}
) {
  const query = await getBaseAllPermissionsQuery(_userAgentId, { transacting });

  // eslint-disable-next-line camelcase
  if (type_$startssWith) {
    query.type_$startssWith = _type;
  } else {
    query.type = _type;
  }

  const items = await find(query, {
    transacting,
  });

  if (returnAllItemPermission) return items;

  return _.uniq(_.map(items, 'item'));
}

module.exports = {
  getAllItemsForTheUserAgentHasPermissionsByType,
};
