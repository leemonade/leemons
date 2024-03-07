const _ = require('lodash');

function transformPermissionKeysToObjects({ jsonSchema, keys, prefix, ctx }) {
  const result = {};
  _.forEach(keys, (key) => {
    const partials = _.split(key, '.');
    const profileId = _.last(partials);
    const saveKey = _.join(_.slice(partials, 0, partials.length - 2), '.');
    if (!Object.prototype.hasOwnProperty.call(result, profileId)) {
      result[profileId] = [];
    }
    result[profileId].push({
      permissionName: ctx.prefixPN(`${prefix}.${saveKey}`),
      actionNames: _.get(jsonSchema, key),
    });
  });

  return result;
}

function transformPermissionKeysToObjectsByType({ jsonSchema, keysByType, prefix, ctx }) {
  return {
    profiles: transformPermissionKeysToObjects({
      jsonSchema,
      keys: keysByType.profiles,
      prefix,
      ctx,
    }),
    roles: transformPermissionKeysToObjects({ jsonSchema, keys: keysByType.roles, prefix, ctx }),
  };
}

module.exports = { transformPermissionKeysToObjects, transformPermissionKeysToObjectsByType };
