const { validatePluginName, validateNotExistLocation } = require('../../validations/exists');
const { translations, getTranslationKey } = require('../translations');
const { validateAddLocation } = require('../../validations/dataset-location');
const { table } = require('../tables');

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
async function updateLocation(
  { name, description, locationName, pluginName },
  { transacting: _transacting } = {}
) {
  validateAddLocation({ name, description, locationName, pluginName });
  validatePluginName(pluginName, this.calledFrom);
  await validateNotExistLocation(locationName, pluginName, { transacting: _transacting });

  return global.utils.withTransaction(
    async (transacting) => {
      const promises = [table.dataset.update({ locationName, pluginName }, {}, { transacting })];
      if (translations()) {
        if (name) {
          promises.push(
            translations().contents.setKey(
              getTranslationKey(locationName, pluginName, 'name'),
              name,
              { transacting }
            )
          );
        }
        if (description) {
          promises.push(
            translations().contents.setKey(
              getTranslationKey(locationName, pluginName, 'description'),
              description,
              { transacting }
            )
          );
        }
      }
      const response = await Promise.all(promises);
      if (response[1] && !response[1].warnings) response[0].name = name;
      if (response[2] && !response[2].warnings) response[0].description = description;
      return response[0];
    },
    table.dataset,
    _transacting
  );
}

module.exports = updateLocation;
