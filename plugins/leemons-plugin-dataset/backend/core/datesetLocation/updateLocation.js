const { getTranslationKey } = require('@leemons/multilanguage');
const { validatePluginName, validateNotExistLocation } = require('../../validations/exists');
const { validateAddLocation } = require('../../validations/datasetLocation');

/** *
 *  ES:
 *  Acyualiza una localización para usar un dataset, usualmente se añade una localización en cada sitio
 *  de tu plugin donde quieres permitir que el administrador pueda añadir campos adicionales, ya sean
 *  predefinidos por tu plugin o creados por el administrador
 *
 *  EN:
 *  Update a location to use a dataset, usually you add a location in each place of your plugin where
 *  you want to allow the administrator to add additional fields, either predefined by your plugin
 *  or created by the administrator.
 *
 *  @public
 *  @static
 *  @param {DatasetUpdateLocation} data - New dataset location
 *  @param {any=} transacting - DB Transaction
 *  @return {Promise<DatasetLocation>} The new dataset location
 *  */
async function updateLocation({ name, description, locationName, pluginName, ctx }) {
  validateAddLocation({ name, description, locationName, pluginName });
  validatePluginName({ pluginName, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistLocation({ locationName, pluginName, ctx });

  const promises = [
    ctx.tx.db.Dataset.findOneAndUpdate({ locationName, pluginName }, {}, { lean: true, new: true }),
  ];
  if (name) {
    promises.push(
      ctx.tx.call('multilanguage.contents.setKey', {
        key: getTranslationKey({ locationName, pluginName, key: 'name', ctx }),
        data: name,
      })
    );
  }
  if (description) {
    promises.push(
      ctx.tx.call('multilanguage.contents.setKey', {
        key: getTranslationKey({ locationName, pluginName, key: 'description', ctx }),
        data: description,
      })
    );
  }
  const response = await Promise.all(promises);
  if (response[1] && !response[1].warnings) response[0].name = name;
  if (response[2] && !response[2].warnings) response[0].description = description;
  return response[0];
}

module.exports = updateLocation;
