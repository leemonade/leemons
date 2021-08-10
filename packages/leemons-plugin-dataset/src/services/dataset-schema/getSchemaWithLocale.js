const _ = require('lodash');
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
 *  @param {boolean=} defaultWithEmptyValues - Define if the values of default locales is empty = ""
 *  @return {Promise<Action>} The new dataset location
 *  */
async function getSchemaWithLocale(
  locationName,
  pluginName,
  locale,
  { defaultWithEmptyValues, transacting } = {}
) {
  validateLocationAndPluginAndLocale(locationName, pluginName, locale, true);
  await validateNotExistLocation(locationName, pluginName, { transacting });
  await validateNotExistSchema(locationName, pluginName, { transacting });
  await validateNotExistSchemaLocale(locationName, pluginName, locale, { transacting });

  const defaultLocale = await leemons.getPlugin('users').services.platform.getDefaultLocale();

  const [schema, schemaLocale, defaultSchemaLocale] = await Promise.all([
    getSchema.call(this, locationName, pluginName),
    getSchemaLocale.call(this, locationName, pluginName, locale),
    getSchemaLocale.call(this, locationName, pluginName, defaultLocale),
  ]);

  if (defaultWithEmptyValues) {
    _.forEach(global.utils.getObjectArrayKeys(defaultSchemaLocale.schemaData), (key) => {
      _.set(defaultSchemaLocale.schemaData, key, '');
    });
    _.forEach(global.utils.getObjectArrayKeys(defaultSchemaLocale.uiData), (key) => {
      _.set(defaultSchemaLocale.uiData, key, '');
    });
  }

  schema.schemaData = _.merge(defaultSchemaLocale.schemaData, schemaLocale.schemaData);
  schema.uiData = _.merge(defaultSchemaLocale.uiData, schemaLocale.uiData);
  schema.compileJsonSchema = global.utils.squirrelly.render(
    JSON.stringify(schema.jsonSchema),
    schema.schemaData
  );
  schema.compileJsonUI = global.utils.squirrelly.render(
    JSON.stringify(schema.jsonUI),
    schema.uiData
  );

  schema.compileJsonSchema = JSON.parse(schema.compileJsonSchema);
  schema.compileJsonUI = JSON.parse(schema.compileJsonUI);

  return schema;
}

module.exports = getSchemaWithLocale;
