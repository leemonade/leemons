/**
 * ES:
 * Añade el prefijo del plugin
 *
 * EN:
 * Add the plugin prefix
 *
 * @public
 * @static
 * @param {string} str - A name to identify the Menu (just to admin it)
 * @return {string} str with plugin name prefix
 * */
function prefixPN(str) {
  return `plugins.${leemons.plugin.name}.${str}`;
}

module.exports = prefixPN;
