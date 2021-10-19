const _ = require('lodash');
const { getBaseAllPermissionsQuery } = require('./getBaseAllPermissionsQuery');
const { count } = require('../../item-permissions/count');

async function userAgentHasPermissionToItem(_userAgentId, _item, { transacting } = {}) {
  const query = await getBaseAllPermissionsQuery(_userAgentId, { transacting });

  query.item = _item;

  const c = await count(query, {
    transacting,
  });

  return !!c;
}

module.exports = {
  userAgentHasPermissionToItem,
};
