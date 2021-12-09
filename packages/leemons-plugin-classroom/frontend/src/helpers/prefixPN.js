/**
 * ES:
 * Añade el prefijo del plugin
 *
 * EN:
 * Add the plugin prefix
 *
 * @public
 * @static
 * @param {string} str - A name to identify
 * @return {string} str with plugin name prefix
 * */
export default function prefixPN(str) {
  return `plugins.classroom.${str}`;
}
