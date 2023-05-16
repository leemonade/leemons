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
const { validateAddSchema } = require('../../validations/dataset-schema');
const { table } = require('../tables');

/** *
 *  ES:
 *  Actualiza los schemas del dataset, solo el dueño de la localizacion puede actualiza los schemas
 *
 *  EN:
 *  Update the schemas of the dataset, only the owner of the locale can update the schemas
 *
 *  @public
 *  @static
 *  @param {DatasetUpdateSchema} data
 *  @param {any=} transacting - DB Transaction
 *  @return {Promise<DatasetSchema>}
 *  */
async function updateSchema(
  { locationName, pluginName, jsonSchema, jsonUI },
  { transacting: _transacting } = {}
) {
  validateAddSchema({ locationName, pluginName, jsonSchema, jsonUI });
  validatePluginName(pluginName, this.calledFrom);
  await validateNotExistLocation(locationName, pluginName, { transacting: _transacting });
  await validateNotExistSchema(locationName, pluginName, { transacting: _transacting });

  return global.utils.withTransaction(
    async (transacting) => {
      // ES: Pillamos los permisos por perfil viejos para el jsonSchema
      // EN: We set the old permissions per profile for jsonSchema
      const { jsonSchema: oldJsonSchema } = await table.dataset.findOne({
        locationName,
        pluginName,
      });

      // ES: Transformamos los jsonSchema
      // EN: We transform the jsonSchema
      const { profiles: oldProfilePermissions, roles: oldRolesPermissions } =
        transformPermissionKeysToObjectsByType(
          JSON.parse(oldJsonSchema),
          getJsonSchemaProfilePermissionsKeysByType(JSON.parse(oldJsonSchema)),
          `${locationName}.${pluginName}`
        );

      const { profiles: newProfilePermissions, roles: newRolesPermissions } =
        transformPermissionKeysToObjectsByType(
          jsonSchema,
          getJsonSchemaProfilePermissionsKeysByType(jsonSchema),
          `${locationName}.${pluginName}`
        );

      const removePermissionsPromises = [];

      // ES: Borramos todos los permisos antiguos que se añadieron el perfil para mas adelante añadir los nuevos
      // EN: We delete all the old permissions that were added to the profile to add the new ones later.
      _.forIn(oldProfilePermissions, (permissions, profileId) => {
        removePermissionsPromises.push(
          leemons
            .getPlugin('users')
            .services.profiles.removeCustomPermissionsByName(
              profileId,
              _.map(permissions, 'permissionName'),
              { transacting }
            )
        );
      });
      _.forIn(oldRolesPermissions, (permissions, roleId) => {
        removePermissionsPromises.push(
          leemons
            .getPlugin('users')
            .services.roles.removePermissionsByName(roleId, _.map(permissions, 'permissionName'), {
              removeCustomPermissions: true,
              transacting,
            })
        );
      });

      await Promise.all(removePermissionsPromises);

      const promises = [
        // ES: Actualizamos el dataset
        // EN: We update the dataset
        table.dataset.update(
          { locationName, pluginName },
          {
            jsonSchema: JSON.stringify(jsonSchema),
            jsonUI: JSON.stringify(jsonUI),
          },
          { transacting }
        ),
      ];

      // ES: Añadimos de nuevo los permisos despues que borraramos los antiguos
      // EN: We add the permissions again after deleting the old ones.
      _.forIn(newProfilePermissions, (permissions, profileId) => {
        promises.push(
          leemons
            .getPlugin('users')
            .services.profiles.addCustomPermissions(profileId, permissions, {
              transacting,
            })
        );
      });

      _.forIn(newRolesPermissions, (permissions, roleId) => {
        promises.push(
          leemons.getPlugin('users').services.roles.addPermissionMany(roleId, permissions, {
            isCustom: true,
            transacting,
          })
        );
      });

      const [dataset] = await Promise.all(promises);

      dataset.jsonSchema = JSON.parse(dataset.jsonSchema);
      dataset.jsonUI = JSON.parse(dataset.jsonUI);

      return dataset;
    },
    table.dataset,
    _transacting
  );
}

module.exports = updateSchema;
