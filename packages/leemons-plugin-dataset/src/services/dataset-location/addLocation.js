const { translations, getTranslationKey } = require('../translations');
const existLocation = require('./existLocation');
const { validateAddLocation } = require('../../validations/dataset-location');
const { table } = require('../tables');

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
 *  @param {any=} transacting - DB Transaction
 *  @return {Promise<DatasetLocation>} The new dataset location
 *  */
async function addLocation(
  { name, description, locationName, pluginName },
  { transacting: _transacting } = {}
) {
  validateAddLocation({ name, description, locationName, pluginName });
  if (pluginName !== this.calledFrom) throw new Error(`The plugin name must be ${this.calledFrom}`);
  if (await existLocation(locationName, pluginName, { transacting: _transacting }))
    throw new Error(`The '${locationName}' location already exist`);
  return global.utils.withTransaction(
    async (transacting) => {
      const promises = [table.dataset.create({ locationName, pluginName }, { transacting })];
      if (translations()) {
        if (name) {
          promises.push(
            translations().contents.addManyByKey(
              getTranslationKey(locationName, pluginName, 'name'),
              name,
              { transacting }
            )
          );
        }
        if (description) {
          promises.push(
            translations().contents.addManyByKey(
              getTranslationKey(locationName, pluginName, 'description'),
              description,
              { transacting }
            )
          );
        }
      }
      // TODO Añadir que se agrege un nuevo apartado en el menu del plugin para los datasets si aun no lo tiene ya
      const response = await Promise.all(promises);
      if (response[1] && !response[1].warnings) response[0].name = name;
      if (response[2] && !response[2].warnings) response[0].description = description;
      return response[0];
    },
    table.dataset,
    _transacting
  );
}

module.exports = addLocation;
