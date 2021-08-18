/**
 * Return the key for translation
 * @public
 * @static
 * @param {string} actionName - Action name
 * @param {string=} key - Another key like description or my-property-to-translate
 * @return {string}
 * */
function getTranslationKey(actionName, key) {
  const pluginName = 'plugins.users';
  if (key) return `${pluginName}.${actionName}.${key}`;
  return `${pluginName}.${actionName}`;
}

module.exports = { getTranslationKey };
