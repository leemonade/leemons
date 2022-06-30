const { validateExistSchemaLocaleData } = require('../../validations/dataset-schema-locale');
const { translations, getTranslationKey } = require('../translations');

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
async function _existSchemaLocale(locationName, pluginName, key, locale, { transacting } = {}) {
  validateExistSchemaLocaleData({ locationName, pluginName, key, locale });
  if (!translations()) throw new Error('The translation plugin is required');
  return translations().contents.has(getTranslationKey(locationName, pluginName, key), locale, {
    transacting,
  });
}

async function existSchemaLocale(locationName, pluginName, locale, { transacting } = {}) {
  const responses = await Promise.all([
    _existSchemaLocale(locationName, pluginName, 'jsonSchema', locale, { transacting }),
    _existSchemaLocale(locationName, pluginName, 'jsonUI', locale, { transacting }),
  ]);
  return responses[0] && responses[1];
}

module.exports = existSchemaLocale;
