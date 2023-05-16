const _ = require('lodash');
const { transformPermissionKeysToObjectsByType } = require('./transformPermissionKeysToObjects');
const { getJsonSchemaProfilePermissionsKeysByType } = require('./transformJsonOrUiSchema');
const {
  validatePluginName,
  validateNotExistLocation,
  validateExistSchema,
} = require('../../validations/exists');
const { validateAddSchema } = require('../../validations/dataset-schema');
const { table } = require('../tables');

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
async function addSchema(
  { locationName, pluginName, jsonSchema, jsonUI },
  { transacting: _transacting } = {}
) {
  validateAddSchema({ locationName, pluginName, jsonSchema, jsonUI });
  validatePluginName(pluginName, this.calledFrom);
  await validateNotExistLocation(locationName, pluginName, { transacting: _transacting });
  await validateExistSchema(locationName, pluginName, { transacting: _transacting });

  return global.utils.withTransaction(
    async (transacting) => {
      const { profiles: profilePermissions, roles: rolesPermissions } =
        transformPermissionKeysToObjectsByType(
          jsonSchema,
          getJsonSchemaProfilePermissionsKeysByType(jsonSchema),
          `${locationName}.${pluginName}`
        );

      const promises = [
        table.dataset.update(
          { locationName, pluginName },
          {
            jsonSchema: JSON.stringify(jsonSchema),
            jsonUI: JSON.stringify(jsonUI),
          },
          { transacting }
        ),
      ];

      _.forIn(profilePermissions, (permissions, profileId) => {
        promises.push(
          leemons
            .getPlugin('users')
            .services.profiles.addCustomPermissions(profileId, permissions, {
              transacting,
            })
        );
      });

      _.forIn(rolesPermissions, (permissions, roleId) => {
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

module.exports = addSchema;
