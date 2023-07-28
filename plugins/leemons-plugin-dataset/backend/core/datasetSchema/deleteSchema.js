const _ = require('lodash');
const {
  transformPermissionKeysToObjects,
  transformPermissionKeysToObjectsByType,
} = require('./transformPermissionKeysToObjects');
const {
  getJsonSchemaProfilePermissionsKeys,
  getJsonSchemaProfilePermissionsKeysByType,
} = require('./transformJsonOrUiSchema');
const {
  validatePluginName,
  validateNotExistLocation,
  validateNotExistSchema,
} = require('../../validations/exists');
const { getTranslationKey, translations } = require('../translations');
const { validateLocationAndPlugin } = require('../../validations/dataset-location');
const { table } = require('../tables');
const deleteValues = require('../dataset-values/deleteValues');

/** *
 *  ES:
 *  Borra un schema y todos los datos de las traducciones que existieran
 *
 *  EN:
 *  Deletes a schema and all existing translation data
 *
 *  @public
 *  @static
 *  @param {string} locationName Location name (For backend)
 *  @param {string} pluginName Plugin name (For backend)
 *  @param {any=} transacting - DB Transaction
 *  @return {Promise<boolean>} Return true if delete is ok
 *  */
async function deleteSchema(
  locationName,
  pluginName,
  { deleteValues: _deleteValues, transacting: _transacting } = {}
) {
  validateLocationAndPlugin(locationName, pluginName);
  validatePluginName(pluginName, this.calledFrom);
  await validateNotExistLocation(locationName, pluginName, { transacting: _transacting });
  await validateNotExistSchema(locationName, pluginName, { transacting: _transacting });

  return global.utils.withTransaction(
    async (transacting) => {
      // ES: Pillamos los permisos por perfil para el jsonSchema
      // EN: We set the permissions per profile for jsonSchema
      const { jsonSchema } = await table.dataset.findOne(
        { locationName, pluginName },
        { transacting }
      );

      const { profiles: profilePermissions, roles: rolesPermissions } =
        transformPermissionKeysToObjectsByType(
          jsonSchema,
          getJsonSchemaProfilePermissionsKeysByType(jsonSchema),
          `${locationName}.${pluginName}`
        );

      if (_deleteValues) {
        await deleteValues.call(this, locationName, pluginName, { transacting });
      }

      const promises = [
        table.dataset.update(
          { locationName, pluginName },
          {
            jsonSchema: null,
            jsonUI: null,
          },
          { transacting }
        ),
      ];

      // ES: Borramos todos los permisos que se añadieron al perfil para este dataset
      // EN: Delete all permissions that were added to the profile for this dataset
      _.forIn(profilePermissions, (permissions, profileId) => {
        promises.push(
          leemons
            .getPlugin('users')
            .services.profiles.removeCustomPermissionsByName(
              profileId,
              _.map(permissions, 'permissionName'),
              { transacting }
            )
        );
      });
      _.forIn(rolesPermissions, (permissions, roleId) => {
        promises.push(
          leemons
            .getPlugin('users')
            .services.roles.removePermissionsByName(roleId, _.map(permissions, 'permissionName'), {
              removeCustomPermissions: true,
              transacting,
            })
        );
      });

      // ES: Borramos traducciones
      // EN: We delete translations
      if (translations()) {
        promises.push(
          translations().contents.deleteAll(
            { key: getTranslationKey(locationName, pluginName, 'jsonSchema') },
            { transacting }
          )
        );
        promises.push(
          translations().contents.deleteAll(
            { key: getTranslationKey(locationName, pluginName, 'jsonUI') },
            { transacting }
          )
        );
      }

      await Promise.all(promises);

      return true;
    },
    table.dataset,
    _transacting
  );
}

module.exports = deleteSchema;
