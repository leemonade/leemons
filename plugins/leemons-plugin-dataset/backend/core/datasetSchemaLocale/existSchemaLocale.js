const { getTranslationKey } = require('leemons-multilanguage');
const { validateExistSchemaLocaleData } = require('../../validations/datasetSchemaLocale');

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
 * existLocation('users-dataset', 'users');
 * @return {Promise<boolean>}
 * */
async function _existSchemaLocale({ locationName, pluginName, key, locale, ctx }) {
  validateExistSchemaLocaleData({ locationName, pluginName, key, locale });
  return ctx.tx.call('multilanguage.contents.has', {
    key: getTranslationKey({ locationName, pluginName, key, ctx }),
    locale,
  });
}

async function existSchemaLocale({ locationName, pluginName, locale, ctx }) {
  const responses = await Promise.all([
    _existSchemaLocale({ locationName, pluginName, key: 'jsonSchema', locale, ctx }),
    _existSchemaLocale({ locationName, pluginName, key: 'jsonUI', locale, ctx }),
  ]);
  return responses[0] && responses[1];
}

module.exports = existSchemaLocale;
