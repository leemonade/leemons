const _ = require('lodash');
const { validatePermissionName } = require('../../validations/exists');
const { validateUserAddCustomPermission } = require('../../validations/permissions');
const { table } = require('../tables');

/**
 *
 * @public
 * @static
 * @param {UserAddCustomPermission || UserAddCustomPermission[]} data - New permission data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function removeCustomPermissionForAllUserAgents(data, { transacting } = {}) {
  const _data = _.isArray(data) ? data : [data];
  _.forEach(_data, (d) => {
    validatePermissionName(d.permissionName, this.calledFrom);
    validateUserAddCustomPermission(d);
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
