const { getTranslationKey } = require('@leemons/multilanguage');

const { validateLocationAndPluginAndLocale } = require('../../validations/datasetLocation');
const {
  validateNotExistSchemaLocale,
  validateNotExistSchema,
  validateNotExistLocation,
  validatePluginName,
} = require('../../validations/exists');

/** *
 *  ES:
 *  Devuelve los datos de una traduccion para un schema
 *
 *  EN:
 *  Returns the data of a translation for a schema
 *
 *  @public
 *  @static
 *  @param {string} locationName - Location name
 *  @param {string} pluginName - Plugin name
 *  @param {string} locale - Locale to get
 *  @param {any=} transacting - DB Transaction
 *  @return {Promise<{schemaData, uiData}>} The json data
 *  */
async function getSchemaLocale({ locationName, pluginName, locale, ctx }) {
  validateLocationAndPluginAndLocale(locationName, pluginName, locale, true);
  validatePluginName({ pluginName, calledFrom: ctx.callerPlugin, ctx });

  await validateNotExistLocation({ locationName, pluginName, ctx });
  await validateNotExistSchema({ locationName, pluginName, ctx });
  await validateNotExistSchemaLocale({ locationName, pluginName, locale, ctx });

  const [schemaData, uiData] = await Promise.all([
    ctx.tx.call('multilanguage.contents.getValue', {
      key: getTranslationKey({ locationName, pluginName, key: 'jsonSchema', ctx }),
      locale,
    }),
    ctx.tx.call('multilanguage.contents.getValue', {
      key: getTranslationKey({ locationName, pluginName, key: 'jsonUI', ctx }),
      locale,
    }),
  ]);

  return {
    schemaData: JSON.parse(schemaData || null),
    uiData: JSON.parse(uiData || null),
    locationName,
    pluginName,
    locale,
  };
}

module.exports = getSchemaLocale;
