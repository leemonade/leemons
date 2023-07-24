const _ = require('lodash');
const { getBaseAllPermissionsQuery } = require('./getBaseAllPermissionsQuery');
const { count } = require('../../item-permissions/count');

async function userAgentHasPermissionToItem({ userAgentId: _userAgentId, item: _item, ctx }) {
  const query = await getBaseAllPermissionsQuery({ userAgentId: _userAgentId, ctx });

  if (_.isArray(_item)) {
    query.item = _item;
    const itemPermissions = await ctx.tx.db.ItemPermissions.find(query).lean();

    return _.uniq(_.map(itemPermissions, 'item'));
  }

  query.item = _item;
  const c = await count({ params: query, ctx });

  return !!c;
}

module.exports = {
  userAgentHasPermissionToItem,
};
