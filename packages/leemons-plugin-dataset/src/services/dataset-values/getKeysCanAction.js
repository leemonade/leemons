const _ = require('lodash');
const prefixPN = require('../../helpers/prefixPN');

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
 *  @param {UserAuth} userAuth - User auth
 *  @param {string | string[]} _actions
 *  @param {any=} transacting - DB Transaction
 *
 *  @return {any} Keys with permits
 *  */
async function getKeysCanAction(
  locationName,
  pluginName,
  userAuth,
  _actions,
  { transacting } = {}
) {
  const actions = _.isArray(_actions) ? _actions : [_actions];
  const userPermissions = await leemons.plugins.users.services.users.getUserPermissions(userAuth, {
    query: {
      permissionName_$startssWith: prefixPN(`${locationName}.${pluginName}`),
    },
    transacting,
  });

  const goodKeys = [];

  _.forEach(userPermissions, ({ permissionName, actionNames }) => {
    if (actionNames.some((r) => actions.indexOf(r) >= 0)) {
      goodKeys.push(_.last(_.split(permissionName, '.')));
    }
  });

  return goodKeys;
}

module.exports = getKeysCanAction;
