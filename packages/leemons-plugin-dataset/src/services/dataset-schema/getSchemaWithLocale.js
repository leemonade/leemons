const { translations, getTranslationKey } = require('../translations');
const existSchema = require('./existSchema');
const existLocation = require('../dataset-location/existLocation');
const existSchemaLocale = require('../dataset-schema-locale/existSchemaLocale');
const getSchema = require('./getSchema');
const getSchemaLocale = require('../dataset-schema-locale/getSchemaLocale');
const { validateLocationAndPluginAndLocale } = require('../../validations/dataset-location');
const { table } = require('../tables');

/** *
 *  ES:
 *  Devuelve un schema ya compilado con los datos del idioma especificado si es que ambas cosas existen
 *
 *  EN:
 *  Returns a schema already compiled with the data of the specified language if both exist
 *
 *  @public
 *  @static
 *  @param {string} locationName - Location name
 *  @param {string} pluginName - Plugin name
 *  @param {string} locale
 *  @param {any=} transacting - DB Transaction
 *  @return {Promise<Action>} The new dataset location
 *  */
async function getSchemaWithLocale(locationName, pluginName, locale, { transacting } = {}) {
  validateLocationAndPluginAndLocale(locationName, pluginName, locale, true);
  if (!(await existLocation(locationName, pluginName, { transacting })))
    throw new Error(`The '${locationName}' location not exist`);
  if (!(await existSchema(locationName, pluginName, { transacting })))
    throw new Error(`The schema for '${locationName}' location not exist`);
  if (!(await existSchemaLocale(locationName, pluginName, 'jsonSchema', locale, { transacting })))
    throw new Error(`"${locale}" language data for "${locationName}" localization not exists.`);
  if (!(await existSchemaLocale(locationName, pluginName, 'jsonUI', locale, { transacting })))
    throw new Error(`"${locale}" language data for "${locationName}" localization not exists.`);

  const [schema, schemaLocale] = await Promise.all([
    getSchema.call(this, locationName, pluginName),
    getSchemaLocale.call(this, locationName, pluginName, locale),
  ]);

  schema.schemaData = schemaLocale.schemaData;
  schema.uiData = schemaLocale.uiData;
  schema.compileJsonSchema = global.utils.squirrelly.render(
    JSON.stringify(schema.jsonSchema),
    schema.schemaData
  );
  schema.compileJsonUi = global.utils.squirrelly.render(
    JSON.stringify(schema.jsonUI),
    schema.uiData
  );

  schema.compileJsonSchema = JSON.parse(schema.compileJsonSchema);
  schema.compileJsonUi = JSON.parse(schema.compileJsonUi);

  return schema;
}

module.exports = getSchemaWithLocale;
