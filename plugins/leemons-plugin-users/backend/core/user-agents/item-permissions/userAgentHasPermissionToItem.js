const _ = require('lodash');
const { getBaseAllPermissionsQuery } = require('./getBaseAllPermissionsQuery');
const { count } = require('../../item-permissions/count');
const { table } = require('../../tables');

async function userAgentHasPermissionToItem(_userAgentId, _item, { transacting } = {}) {
  const query = await getBaseAllPermissionsQuery(_userAgentId, { transacting });

  if (_.isArray(_item)) {
    query.item_$in = _item;
    const itemPermissions = await table.itemPermissions.find(query, {
      transacting,
    });

    return _.uniq(_.map(itemPermissions, 'item'));
  }

  query.item = _item;
  const c = await count(query, {
    transacting,
  });

  return !!c;
}

module.exports = {
  userAgentHasPermissionToItem,
};
