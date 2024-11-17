/**
 * Return the key for translation
 * @public
 * @static
 * @param {string} permissionName - Permission name
 * @param {string=} key - Another key like description or my-property-to-translate
 * @return {string}
 * */
export function getTranslationKey(permissionName, key) {
  const pluginName = 'users';
  if (key) return `${pluginName}.${permissionName}.${key}`;
  return `${pluginName}.${permissionName}`;
}
