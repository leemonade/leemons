const { getTranslationKey } = require('leemons-multilanguage');
const { validatePluginName, validateExistLocation } = require('../../validations/exists');
const { validateAddLocation } = require('../../validations/datasetLocation');

/** *
 *  ES:
 *  Una localización donde se mostrara un dataset, usualmente se añade una localización en cada sitio
 *  de tu plugin donde quieres permitir que el administrador pueda añadir campos adicionales, ya sean
 *  predefinidos por tu plugin o creados por el administrador
 *
 *  EN:
 *  A location where a dataset will be displayed, usually you add a location in each site of your
 *  plugin where you want to allow the administrator to add additional fields, either predefined by
 *  your plugin or created by the administrator.
 *
 *  @public
 *  @static
 *  @param {DatasetAddLocation} data - New dataset location
 *  @return {Promise<DatasetLocation>} The new dataset location
 *  */
async function addLocation({ name, description, locationName, pluginName, ctx }) {
  validateAddLocation({ name, description, locationName, pluginName });
  validatePluginName(pluginName, ctx.callerPlugin);
  await validateExistLocation(locationName, pluginName);

  const promises = [ctx.tx.db.Dataset.create({ locationName, pluginName })];

  if (name) {
    promises.push(
      ctx.tx.call('multilanguage.contents.addManyByKey', {
        key: getTranslationKey({ locationName, pluginName, key: 'name', ctx }),
        data: name,
      })
    );
  }
  if (description) {
    promises.push(
      ctx.tx.call('multilanguage.contents.addManyByKey', {
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

module.exports = addLocation;
