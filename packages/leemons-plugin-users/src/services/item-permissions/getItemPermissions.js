const _ = require('lodash');
const { table } = require('../tables');

async function getItemPermissions(item, type, { returnRaw, transacting } = {}) {
  const items = _.isArray(item) ? item : [item];
  const results = await table.itemPermissions.find({ item_$in: items, type }, { transacting });

  if (returnRaw) {
    return results;
  }

  const permissions = {};
  _.forEach(results, (result) => {
    if (!permissions[result.permissionName]) {
      permissions[result.permissionName] = {
        permissionName: result.permissionName,
        actionNames: [],
      };
    }
    permissions[result.permissionName].actionNames.push(result.actionName);
  });

  return Object.values(permissions);
}

module.exports = { getItemPermissions };
