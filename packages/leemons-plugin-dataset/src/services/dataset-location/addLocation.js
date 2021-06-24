const { existLocation } = require('./existLocation');
const { table } = require('../tables');

/**
 * ES:
 * Añade una localización para usar un dataset, usualmente se añade una localización en cada sitio
 * de tu plugin donde quieres permitir que el administrador pueda añadir campos adicionales, ya sean
 * predefinidos por tu plugin o creados por el administrador
 *
 * EN:
 * Add a location to use a dataset, usually you add a location in each place of your plugin where
 * you want to allow the administrator to add additional fields, either predefined by your plugin
 * or created by the administrator.
 *
 * @public
 * @static
 * @param {DatasetAddLocation} data - New dataset location
 * @return {Promise<Action>} The new dataset location
 * */
async function addLocation({ name, description, locationName, pluginName }) {
  if (pluginName !== this.calledFrom) throw new Error(`The plugin name must be ${this.calledFrom}`);
  if (await existLocation(locationName, pluginName))
    throw new Error(`The '${locationName}' location already exist`);
  // TODO Añadir traducciones
}

module.exports = { addLocation };
