const _ = require('lodash');
const { getTranslationKey } = require('@leemons/multilanguage');
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
const { validateLocationAndPlugin } = require('../../validations/datasetLocation');

const deleteValues = require('../datasetValues/deleteValues');

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
async function deleteSchema({ locationName, pluginName, deleteValues: _deleteValues, ctx }) {
  validateLocationAndPlugin(locationName, pluginName);
  validatePluginName({ pluginName, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistLocation({ locationName, pluginName, ctx });
  await validateNotExistSchema({ locationName, pluginName, ctx });

  // ES: Pillamos los permisos por perfil para el jsonSchema
  // EN: We set the permissions per profile for jsonSchema
  const { jsonSchema } = await ctx.tx.db.Dataset.findOne({ locationName, pluginName }).lean();

  const { profiles: profilePermissions, roles: rolesPermissions } =
    transformPermissionKeysToObjectsByType({
      jsonSchema,
      keysByType: getJsonSchemaProfilePermissionsKeysByType({ jsonSchema }),
      prefix: `${locationName}.${pluginName}`,
      ctx,
    });

  if (_deleteValues) {
    await deleteValues({ locationName, pluginName, ctx });
  }

  const promises = [
    ctx.tx.db.Dataset.updateOne(
      { locationName, pluginName },
      {
        jsonSchema: null,
        jsonUI: null,
      }
    ),
  ];

  // ES: Borramos todos los permisos que se añadieron al perfil para este dataset
  // EN: Delete all permissions that were added to the profile for this dataset
  _.forIn(profilePermissions, (permissions, profileId) => {
    promises.push(
      ctx.tx.call('users.profiles.removeCustomPermissionsByName', {
        profileId,
        permissions: _.map(permissions, 'permissionName'),
      })
    );
  });
  _.forIn(rolesPermissions, (permissions, roleId) => {
    promises.push(
      ctx.tx.call('users.roles.removePermissionsByName', {
        roleId,
        permissionNames: _.map(permissions, 'permissionName'),
        removeCustomPermissions: true,
      })
    );
  });

  // ES: Borramos traducciones
  // EN: We delete translations
  promises.push(
    ctx.tx.call('multilanguage.contents.deleteAll', {
      key: getTranslationKey({ locationName, pluginName, key: 'jsonSchema', ctx }),
    })
  );
  promises.push(
    ctx.tx.call('multilanguage.contents.deleteAll', {
      key: getTranslationKey({ locationName, pluginName, key: 'jsonUI', ctx }),
    })
  );

  await Promise.all(promises);

  return true;
}

module.exports = deleteSchema;
