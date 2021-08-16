const _ = require('lodash');

function transformPermissionKeysToObjects(jsonSchema, keys, prefix) {
  const result = {};
  _.forEach(keys, (key) => {
    const partials = _.split(key, '.');
    const profileId = _.last(partials);
    const saveKey = _.join(_.slice(partials, 0, partials.length - 2), '.');
    if (!Object.prototype.hasOwnProperty.call(result, profileId)) {
      result[profileId] = [];
    }
    result[profileId].push({
      permissionName: leemons.plugin.prefixPN(`${prefix}.${saveKey}`),
      actionNames: _.get(jsonSchema, key),
    });
  });

  return result;
}

function transformPermissionKeysToObjectsByType(jsonSchema, keysByType, prefix) {
  return {
    profiles: transformPermissionKeysToObjects(jsonSchema, keysByType.profiles, prefix),
    roles: transformPermissionKeysToObjects(jsonSchema, keysByType.roles, prefix),
  };
}

module.exports = { transformPermissionKeysToObjects, transformPermissionKeysToObjectsByType };
