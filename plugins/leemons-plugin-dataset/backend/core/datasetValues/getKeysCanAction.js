const _ = require('lodash');
const getSchema = require('../datasetSchema/getSchema');

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

async function getKeysCanAction({ locationName, pluginName, userAgent, actions: _actions, ctx }) {
  const actions = _.isArray(_actions) ? _actions : [_actions];
  const promises = [getSchema({ locationName, pluginName, ctx })];
  const currentRoles = _.flatten([userAgent])?.map((ua) => ua.role);

  if (userAgent) {
    const permissionNameTemplate = _.escapeRegExp(ctx.prefixPN(`${locationName}.${pluginName}`));
    promises.push(
      ctx.tx.call('users.permissions.getUserAgentPermissions', {
        userAgent,
        query: {
          permissionName: {
            $regex: `^${permissionNameTemplate}`,
          },
        },
      })
    );
  }

  const [{ jsonSchema }, userPermissions] = await Promise.all(promises);

  const goodKeys = [];
  const optionalKeys = []; // Keys that are required but additional roles can edit them

  if (userPermissions) {
    _.forEach(userPermissions, ({ permissionName, actionNames }) => {
      if (actionNames.some((r) => actions.indexOf(r) >= 0)) {
        goodKeys.push(_.last(_.split(permissionName, '.')));
      }
    });
  }

  _.forIn(jsonSchema.properties, (value, key) => {
    const { permissions, frontConfig = {} } = value;

    if (actions.includes('edit')) {
      const { permissions: config = [] } = frontConfig;
      const additionalRoles = config.filter((permission) => {
        const additionalRole = permission.roles.some((role) => !currentRoles.includes(role.id));
        return permission.edit && additionalRole;
      });

      if (additionalRoles.length > 0) {
        optionalKeys.push(key);
      }
    }

    if (permissions?.['*']?.some((r) => actions.indexOf(r) >= 0)) {
      goodKeys.push(key);
    }
  });

  return { goodKeys, optionalKeys };
}

module.exports = getKeysCanAction;
