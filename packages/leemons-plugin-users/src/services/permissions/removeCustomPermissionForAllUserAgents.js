const _ = require('lodash');
const { existUserAgent } = require('../users/existUserAgent');
const { validatePermissionName } = require('../../validations/exists');
const { validateUserAddCustomPermission } = require('../../validations/permissions');
const { table } = require('../tables');
const { userAgentHasCustomPermission } = require('./userAgentHasCustomPermission');

async function _addCustomPermissionToUserAgent(userAgentId, data, { transacting } = {}) {
  await existUserAgent({ id: userAgentId }, false, { transacting });

  const hasPermissions = _.uniq(
    await Promise.all(
      _.map(data, (d) => userAgentHasCustomPermission(userAgentId, d, { transacting }))
    )
  );
  if (hasPermissions.length > 1 || hasPermissions[0]) {
    throw new Error(`You have already been assigned this custom permit`);
  }

  const dataToCreate = [];
  _.forEach(data, ({ actionNames, ...d }) => {
    _.forEach(actionNames, (actionName) => {
      dataToCreate.push({
        ...d,
        actionName,
        userAgent: userAgentId,
      });
    });
  });

  return table.userAgentPermission.createMany(dataToCreate, { transacting });
}

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
