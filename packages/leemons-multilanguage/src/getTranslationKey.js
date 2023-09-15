const { getPluginNameFromCTX } = require('@leemons/service-name-parser');

/**
 * Return the key for translation
 * @public
 * @static
 * @param param - object
 * @param {string} param.locationName - Location name
 * @param {string} param.pluginName - Plugin name
 * @param {string} param.key - Another key like description or my-property-to-translate
 * @param {Object} param.ctx - moleculer ctx
 * @return {string}
 * */
function getTranslationKey({ locationName, pluginName, key, ctx }) {
  const _pluginName = getPluginNameFromCTX(ctx);
  if (key) return `${_pluginName}.${locationName}.${pluginName}.${key}`;
  return `${_pluginName}.${locationName}.${pluginName}`;
}

module.exports = { getTranslationKey };
