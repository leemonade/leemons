const {
  validateNotExistSchemaLocale,
  validateNotExistSchema,
  validateNotExistLocation,
  validatePluginName,
} = require('../../validations/exists');
const { validateLocationAndPluginAndLocale } = require('../../validations/dataset-location');
const { translations, getTranslationKey } = require('../translations');

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
async function getSchemaLocale(locationName, pluginName, locale, { transacting } = {}) {
  validateLocationAndPluginAndLocale(locationName, pluginName, locale, true);
  validatePluginName(pluginName, this.calledFrom);
  await validateNotExistLocation(locationName, pluginName, { transacting });
  await validateNotExistSchema(locationName, pluginName, { transacting });
  await validateNotExistSchemaLocale(locationName, pluginName, locale, { transacting });

  const [schemaData, uiData] = await Promise.all([
    translations().contents.getValue(
      getTranslationKey(locationName, pluginName, 'jsonSchema'),
      locale,
      {
        transacting,
      }
    ),
    translations().contents.getValue(
      getTranslationKey(locationName, pluginName, 'jsonUI'),
      locale,
      {
        transacting,
      }
    ),
  ]);

  return {
    schemaData: JSON.parse(schemaData),
    uiData: JSON.parse(uiData),
    locationName,
    pluginName,
    locale,
  };
}

module.exports = getSchemaLocale;
