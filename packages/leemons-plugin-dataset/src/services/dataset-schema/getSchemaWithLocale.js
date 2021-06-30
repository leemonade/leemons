const getSchema = require('./getSchema');
const getSchemaLocale = require('../dataset-schema-locale/getSchemaLocale');
const {
  validateNotExistSchemaLocale,
  validateNotExistLocation,
  validateNotExistSchema,
} = require('../../validations/exists');
const { validateLocationAndPluginAndLocale } = require('../../validations/dataset-location');

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
  await validateNotExistLocation(locationName, pluginName, { transacting });
  await validateNotExistSchema(locationName, pluginName, { transacting });
  await validateNotExistSchemaLocale(locationName, pluginName, locale, { transacting });

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
