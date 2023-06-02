const _ = require('lodash');

function transformArrayToObject(permissionsArray) {
  const result = {
    normal: {},
    target: [],
  };
  _.forEach(permissionsArray, (permission) => {
    if (permission.target) {
      result.target.push(permission);
    } else {
      if (!_.has(result.normal, permission.permissionName)) {
        result.normal[permission.permissionName] = [];
      }
      result.normal[permission.permissionName].push(permission.actionName);
    }
  });
  return result;
}

module.exports = { transformArrayToObject };
