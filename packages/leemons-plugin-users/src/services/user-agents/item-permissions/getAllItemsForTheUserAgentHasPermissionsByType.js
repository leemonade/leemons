const _ = require('lodash');
const { getBaseAllPermissionsQuery } = require('./getBaseAllPermissionsQuery');
const { find } = require('../../item-permissions/find');

async function getAllItemsForTheUserAgentHasPermissionsByType(
  _userAgentId,
  _type,
  // eslint-disable-next-line camelcase
  {
    target,
    ignoreOriginalTarget,
    returnAllItemPermission,
    type_$startssWith,
    transacting,
    item,
  } = {}
) {
  const query = await getBaseAllPermissionsQuery(_userAgentId, { transacting });

  // eslint-disable-next-line camelcase
  if (type_$startssWith) {
    query.type_$startssWith = _type;
  } else {
    query.type = _type;
  }

  if (ignoreOriginalTarget) {
    query.$or = _.map(query.$or, ({ target: t, ...q }) => q);
  }

  if (target) {
    const targetArr = _.isArray(target) ? target : [target];
    query.target_$in = targetArr;
  }

  if (item) {
    const itemArr = _.isArray(item) ? item : [item];
    query.item_$in = itemArr;
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
