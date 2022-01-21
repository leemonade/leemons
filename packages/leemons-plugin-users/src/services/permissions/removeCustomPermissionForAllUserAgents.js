const _ = require('lodash');
const { validatePermissionName } = require('../../validations/exists');
const { validateUserRemoveCustomPermission } = require('../../validations/permissions');
const { table } = require('../tables');

/**
 *
 * @public
 * @static
 * @param {UserAddCustomPermission || UserAddCustomPermission[]} data - New permission data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function removeCustomPermissionForAllUserAgents(_data, { transacting } = {}) {
  const data = _.isArray(_data) ? _data : [_data];
  _.forEach(data, (d) => {
    validatePermissionName(d.permissionName, this.calledFrom);
    validateUserRemoveCustomPermission(d);
  });

  const query = {
    $or: [],
  };
  _.forEach(data, ({ actionNames, ...d }) => {
    const newQuery = { ...d };
    if (_.isArray(actionNames)) {
      newQuery.actionName_$in = actionNames;
    }
    query.$or.push(newQuery);
  });

  return table.userAgentPermission.deleteMany(query, { transacting });
}

module.exports = { removeCustomPermissionForAllUserAgents };
