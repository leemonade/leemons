/**
 * Return the key for translation
 * @public
 * @static
 * @param {string} permissionName - Permission name
 * @param {string=} key - Another key like description or my-property-to-translate
 * @return {string}
 * */
function getTranslationKey(permissionName, key) {
  const pluginName = 'plugins.users';
  if (key) return `${pluginName}.${permissionName}.${key}`;
  return `${pluginName}.${permissionName}`;
}

module.exports = { getTranslationKey };
