const _ = require('lodash');
const { validatePermissionName } = require('../../validations/exists');
const { validateUserRemoveCustomPermission } = require('../../validations/permissions');

/**
 *
 * @public
 * @static
 * @param {UserAddCustomPermission || UserAddCustomPermission[]} data - New permission data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function removeCustomPermissionForAllUserAgents({ data: _data, ctx }) {
  const data = _.isArray(_data) ? _data : [_data];
  _.forEach(data, (d) => {
    validatePermissionName(d.permissionName, ctx.callerPlugin);
    validateUserRemoveCustomPermission(d);
  });

  const query = {
    $or: [],
  };
  _.forEach(data, ({ actionNames, ...d }) => {
    const newQuery = { ...d };
    if (_.isArray(actionNames)) {
      newQuery.actionName = actionNames;
    }
    query.$or.push(newQuery);
  });

  return ctx.tx.db.UserAgentPermission.deleteMany(query);
}

module.exports = { removeCustomPermissionForAllUserAgents };
