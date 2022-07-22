const _ = require('lodash');
const { table } = require('../tables');

async function getItemPermissions(item, type, { transacting } = {}) {
  const results = await table.itemPermissions.find({ item, type }, { transacting });
  const permissions = {};
  _.forEach(results, (result) => {
    if (permissions[result.permissionName]) {
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
