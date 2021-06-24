const constants = require('../../../config/constants');

/**
 * Return the key for translation
 * @public
 * @static
 * @param {string} actionName - Action name
 * @param {string=} key - Another key like description or my-property-to-translate
 * @return {string}
 * */
function getTranslationKey(actionName, key) {
  if (key) return `${constants.actionsName}.${actionName}.${key}`;
  return `${constants.actionsName}.${actionName}`;
}

module.exports = { getTranslationKey };
