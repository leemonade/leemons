const { translations, getTranslationKey } = require('../translations');
const existLocation = require('../dataset-location/existLocation');
const existSchemaLocale = require('./existSchemaLocale');
const existSchema = require('../dataset-schema/existSchema');

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
  if (pluginName !== this.calledFrom) throw new Error(`The plugin name must be ${this.calledFrom}`);
  if (!(await existLocation(locationName, pluginName, { transacting })))
    throw new Error(`The '${locationName}' location not exist`);
  if (!(await existSchema(locationName, pluginName, { transacting })))
    throw new Error(`The schema for '${locationName}' location not exist`);
  if (!(await existSchemaLocale(locationName, pluginName, 'jsonSchema', locale, { transacting })))
    throw new Error(`"${locale}" language data for "${locationName}" localization not exists.`);
  if (!(await existSchemaLocale(locationName, pluginName, 'jsonUI', locale, { transacting })))
    throw new Error(`"${locale}" language data for "${locationName}" localization not exists.`);

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

  return { schemaData: JSON.parse(schemaData), uiData: JSON.parse(uiData) };
}

module.exports = getSchemaLocale;
