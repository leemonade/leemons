const { validateLocationAndPlugin } = require('../../validations/datasetLocation');

/**
 * ES:
 * Comprueba si existe un schema para esa localizacion
 *
 * EN:
 * Check if there is a schema for that location
 *
 * @public
 * @static
 * @param {string} locationName - Location name
 * @param {string} pluginName - Plugin name
 * @param {any=} ctx - moleculer ctx
 * @example
 * existLocation('users-dataset', 'plugins.users');
 * @return {Promise<boolean>}
 * */
async function existSchema({ locationName, pluginName, ctx }) {
  validateLocationAndPlugin(locationName, pluginName);
  const dataset = await ctx.tx.db.Dataset.findOne({ locationName, pluginName }).lean();
  return dataset.jsonSchema && dataset.jsonUI;
}

module.exports = existSchema;
