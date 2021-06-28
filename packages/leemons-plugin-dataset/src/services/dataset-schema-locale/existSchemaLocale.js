const { validateExistSchemaLocale } = require('../../validations/dataset-schema-locale');
const { translations, getTranslationKey } = require('../translations');
const { table } = require('../tables');

/**
 * ES:
 * Comprueba si existen datos para el schema en el idioma especificado
 *
 * EN:
 * Checks if data exists for the schema in the specified language
 *
 * @public
 * @static
 * @param {string} locationName - Location name
 * @param {string} pluginName - Plugin name
 * @param {('jsonSchema' | 'jsonUI')} key - schema | ui
 * @param {string} locale
 * @param {any=} transacting - DB transaction
 * @example
 * existLocation('users-dataset', 'plugins.users');
 * @return {Promise<boolean>}
 * */
async function existSchemaLocale(locationName, pluginName, key, locale, { transacting } = {}) {
  validateExistSchemaLocale({ locationName, pluginName, key, locale });
  if (!translations()) throw new Error('The translation plugin is required');
  return translations().contents.has(getTranslationKey(locationName, pluginName, key), locale, {
    transacting,
  });
}

module.exports = existSchemaLocale;
