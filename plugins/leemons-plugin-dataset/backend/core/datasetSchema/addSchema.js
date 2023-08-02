const _ = require('lodash');
const { transformPermissionKeysToObjectsByType } = require('./transformPermissionKeysToObjects');
const { getJsonSchemaProfilePermissionsKeysByType } = require('./transformJsonOrUiSchema');
const {
  validatePluginName,
  validateNotExistLocation,
  validateExistSchema,
} = require('../../validations/exists');
const { validateAddSchema } = require('../../validations/datasetSchema');

/** *
 *  ES:
 *  Añade los schemas del dataset, solo el dueño de la localizacion puede añadir los schemas.
 *  Si ya existe un schema para esa localizacion devolvera un error
 *
 *  EN:
 *  Adds the schemas of the dataset, only the owner of the location can add schemas.
 *  If a schema already exists for that location it will return an error.
 *
 *  @public
 *  @static
 *  @param {DatasetAddSchema} data - New dataset location
 *  @param {any=} transacting - DB Transaction
 *  @return {Promise<DatasetSchema>} The new dataset location
 *  */
async function addSchema({ locationName, pluginName, jsonSchema, jsonUI, ctx }) {
  validateAddSchema({ locationName, pluginName, jsonSchema, jsonUI });
  validatePluginName({ pluginName, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistLocation({ locationName, pluginName, ctx });
  await validateExistSchema({ locationName, pluginName, ctx });

  const { profiles: profilePermissions, roles: rolesPermissions } =
    transformPermissionKeysToObjectsByType({
      jsonSchema,
      keysByType: getJsonSchemaProfilePermissionsKeysByType({ jsonSchema, ctx }),
      prefix: `${locationName}.${pluginName}`,
      ctx,
    });

  const promises = [
    ctx.tx.db.Dataset.findOneAndUpdate(
      { locationName, pluginName },
      {
        jsonSchema: JSON.stringify(jsonSchema),
        jsonUI: JSON.stringify(jsonUI),
      },
      { new: true }
    ),
  ];

  _.forIn(profilePermissions, (permissions, profileId) => {
    promises.push(ctx.tx.call('users.profiles.addCustomPermissions', { profileId, permissions }));
  });

  _.forIn(rolesPermissions, (permissions, roleId) => {
    promises.push(
      ctx.tx.call('users.roles.addPermissionMany', { roleId, permissions, isCustom: true })
    );
  });

  const [dataset] = await Promise.all(promises);

  dataset.jsonSchema = JSON.parse(dataset.jsonSchema);
  dataset.jsonUI = JSON.parse(dataset.jsonUI);

  return dataset;
}

module.exports = addSchema;
