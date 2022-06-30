const _ = require('lodash');
const getSchema = require('../dataset-schema/getSchema');

/** *
 *  ES:
 *  Devuelve solo los campos a los que el usuario tiene permiso con la accion especificada
 *
 *  EN:
 *  Returns only the fields to which the user has permission with the specified action.
 *
 *  @public
 *  @static
 *  @param {string} locationName
 *  @param {string} pluginName
 *  @param {UserAgent} userAgent - User auth
 *  @param {string | string[]} _actions
 *  @param {any=} transacting - DB Transaction
 *
 *  @return {any} Keys with permits
 *  */

async function getKeysCanAction(
  locationName,
  pluginName,
  userAgent,
  _actions,
  { transacting } = {}
) {
  const actions = _.isArray(_actions) ? _actions : [_actions];
  const promises = [getSchema.call(this, locationName, pluginName, { transacting })];

  if (userAgent) {
    promises.push(
      leemons.getPlugin('users').services.permissions.getUserAgentPermissions(userAgent, {
        query: {
          permissionName_$startssWith: leemons.plugin.prefixPN(`${locationName}.${pluginName}`),
        },
        transacting,
      })
    );
  }

  const [{ jsonSchema }, userPermissions] = await Promise.all(promises);

  const goodKeys = [];

  if (userPermissions) {
    _.forEach(userPermissions, ({ permissionName, actionNames }) => {
      if (actionNames.some((r) => actions.indexOf(r) >= 0)) {
        goodKeys.push(_.last(_.split(permissionName, '.')));
      }
    });
  }

  _.forIn(jsonSchema.properties, (value, key) => {
    if (value.permissions && value.permissions['*']) {
      if (value.permissions['*'].some((r) => actions.indexOf(r) >= 0)) {
        goodKeys.push(key);
      }
    }
  });

  return goodKeys;
}

module.exports = getKeysCanAction;
