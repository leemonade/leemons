const { validateLocationAndPlugin } = require('../../validations/datasetLocation');

/**
 * ES:
 * Comprueba si existe una localizacion para ese nombre y para el plugin actual o el especificado
 *
 * EN:
 * Check if there is a locale for that name and for the current or specified plugin.
 *
 * @public
 * @static
 * @param {string} locationName - Location name
 * @param {string} pluginName - Plugin name
 * @param {Object} ctx - moleculer ctx
 * @example
 * existLocation({locationName: 'users-dataset', pluginName:'users', ctx});
 * @return {Promise<boolean>}
 * */
async function existLocation({ locationName, pluginName, ctx }) {
  validateLocationAndPlugin(locationName, pluginName);
  const result = await ctx.tx.db.Dataset.countDocuments({ locationName, pluginName });
  return !!result;
}

module.exports = existLocation;
