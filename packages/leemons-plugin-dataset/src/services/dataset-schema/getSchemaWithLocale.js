const _ = require('lodash');
const getSchema = require('./getSchema');
const getSchemaLocale = require('../dataset-schema-locale/getSchemaLocale');
const {
  validateNotExistSchemaLocale,
  validateNotExistLocation,
  validateNotExistSchema,
} = require('../../validations/exists');
const { validateLocationAndPluginAndLocale } = require('../../validations/dataset-location');
const getKeysCanAction = require('../dataset-values/getKeysCanAction');

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
 *  @param {any=} userSession - If the user's session comes up, it is checked and returned those fields that at least the user has permissions to view.
 *  @param {boolean=} defaultWithEmptyValues - Define if the values of default locales is empty = ""
 *  @return {Promise<Action>} The new dataset location
 *  */
async function getSchemaWithLocale(
  locationName,
  pluginName,
  locale,
  { defaultWithEmptyValues, userSession, transacting } = {}
) {
  validateLocationAndPluginAndLocale(locationName, pluginName, locale, true);
  await validateNotExistLocation(locationName, pluginName, { transacting });
  await validateNotExistSchema(locationName, pluginName, { transacting });

  const defaultLocale = await leemons.getPlugin('users').services.platform.getDefaultLocale();

  try {
    await validateNotExistSchemaLocale(locationName, pluginName, locale, { transacting });
  } catch (err) {
    if (userSession) {
      locale = defaultLocale;
    } else {
      throw err;
    }
  }

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

  schema.compileJsonSchema = JSON.parse(
    schema.compileJsonSchema.replaceAll('"-*-*-[', '[').replaceAll(']-*-*-"', ']')
  );
  schema.compileJsonUI = JSON.parse(
    schema.compileJsonUI.replaceAll('"-*-*-[', '[').replaceAll(']-*-*-"', ']')
  );

  if (userSession) {
    const goodKeys = await getKeysCanAction(
      locationName,
      pluginName,
      userSession.userAgents,
      'view'
    );
    const editKeys = await getKeysCanAction(
      locationName,
      pluginName,
      userSession.userAgents,
      'edit'
    );
    _.forInRight(schema.compileJsonSchema.properties, (value, key) => {
      if (goodKeys.indexOf(key) < 0) {
        delete schema.compileJsonSchema.properties[key];
        const requiredIndex = schema.compileJsonSchema.required.indexOf(key);
        if (requiredIndex >= 0) {
          schema.compileJsonSchema.required.splice(requiredIndex, 1);
        }
        if (schema.compileJsonUI[key]) {
          delete schema.compileJsonUI[key];
        }
      } else if (editKeys.indexOf(key) < 0) {
        if (!schema.compileJsonUI[key]) {
          schema.compileJsonUI[key] = {};
        }
        schema.compileJsonUI[key]['ui:readonly'] = true;
      }
    });
  }

  return schema;
}

module.exports = getSchemaWithLocale;
