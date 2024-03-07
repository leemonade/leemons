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
const { validateAddSchema } = require('../../validations/datasetSchema');

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
async function updateSchema({ locationName, pluginName, jsonSchema, jsonUI, ctx }) {
  validateAddSchema({ locationName, pluginName, jsonSchema, jsonUI });
  validatePluginName({ pluginName, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistLocation({ locationName, pluginName, ctx });
  await validateNotExistSchema({ locationName, pluginName, ctx });

  // ES: Pillamos los permisos por perfil viejos para el jsonSchema
  // EN: We set the old permissions per profile for jsonSchema
  const { jsonSchema: oldJsonSchema } = await ctx.tx.db.Dataset.findOne({
    locationName,
    pluginName,
  }).lean();

  // ES: Transformamos los jsonSchema
  // EN: We transform the jsonSchema
  const { profiles: oldProfilePermissions, roles: oldRolesPermissions } =
    transformPermissionKeysToObjectsByType({
      jsonSchema: JSON.parse(oldJsonSchema || null),
      keysByType: getJsonSchemaProfilePermissionsKeysByType({
        jsonSchema: JSON.parse(oldJsonSchema || null),
      }),
      prefix: `${locationName}.${pluginName}`,
      ctx,
    });

  const { profiles: newProfilePermissions, roles: newRolesPermissions } =
    transformPermissionKeysToObjectsByType({
      jsonSchema,
      keysByType: getJsonSchemaProfilePermissionsKeysByType({ jsonSchema }),
      prefix: `${locationName}.${pluginName}`,
      ctx,
    });

  const removePermissionsPromises = [];

  // ES: Borramos todos los permisos antiguos que se añadieron el perfil para mas adelante añadir los nuevos
  // EN: We delete all the old permissions that were added to the profile to add the new ones later.
  _.forIn(oldProfilePermissions, (permissions, profileId) => {
    removePermissionsPromises.push(
      ctx.tx.call('users.profiles.removeCustomPermissionsByName', {
        profileId,
        permissions: _.map(permissions, 'permissionName'),
      })
    );
  });
  _.forIn(oldRolesPermissions, (permissions, roleId) => {
    removePermissionsPromises.push(
      ctx.tx.call('users.roles.removePermissionsByName', {
        roleId,
        permissionNames: _.map(permissions, 'permissionName'),
        removeCustomPermissions: true,
      })
    );
  });

  await Promise.all(removePermissionsPromises);

  const promises = [
    // ES: Actualizamos el dataset
    // EN: We update the dataset
    ctx.tx.db.Dataset.findOneAndUpdate(
      { locationName, pluginName },
      {
        jsonSchema: JSON.stringify(jsonSchema),
        jsonUI: JSON.stringify(jsonUI),
      },
      { new: true, lean: true }
    ),
  ];

  // ES: Añadimos de nuevo los permisos despues que borraramos los antiguos
  // EN: We add the permissions again after deleting the old ones.
  _.forIn(newProfilePermissions, (permissions, profileId) => {
    promises.push(ctx.tx.call('users.profiles.addCustomPermissions', { profileId, permissions }));
  });

  _.forIn(newRolesPermissions, (permissions, roleId) => {
    promises.push(
      ctx.tx.call('users.roles.addPermissionMany', { roleId, permissions, isCustom: true })
    );
  });

  const [dataset] = await Promise.all(promises);

  dataset.jsonSchema = JSON.parse(dataset.jsonSchema || null);
  dataset.jsonUI = JSON.parse(dataset.jsonUI || null);

  return dataset;
}

module.exports = updateSchema;
