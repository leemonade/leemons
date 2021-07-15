const _ = require('lodash');
const prefixPN = require('../../helpers/prefixPN');

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
      permissionName: prefixPN(`${prefix}.${saveKey}`),
      actionNames: _.get(jsonSchema, key),
    });
  });

  return result;
}

module.exports = transformPermissionKeysToObjects;
