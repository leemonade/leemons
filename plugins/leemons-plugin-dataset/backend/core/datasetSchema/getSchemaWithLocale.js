const _ = require('lodash');
const { getObjectArrayKeys } = require('@leemons/utils');
const squirrelly = require('squirrelly');
const getSchema = require('./getSchema');
const getSchemaLocale = require('../datasetSchemaLocale/getSchemaLocale');
const {
  validateNotExistSchemaLocale,
  validateNotExistLocation,
  validateNotExistSchema,
} = require('../../validations/exists');
const { validateLocationAndPluginAndLocale } = require('../../validations/datasetLocation');
const getKeysCanAction = require('../datasetValues/getKeysCanAction');

squirrelly.helpers.define('printWithOutErrors', ({ params }) => {
  const it = params[0];
  const prop = params[1];
  const value = _.get(it, prop, '');
  return _.isArray(value) || _.isObject(value) ? `-*-*-${JSON.stringify(value)}-*-*-` : value;
});

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
 *  @param {boolean=} useDefaultLocaleCallback - Define is use the default locale callback
 *  @return {Promise<Action>} The new dataset location
 *  */
async function getSchemaWithLocale({
  locationName,
  pluginName,
  locale,
  defaultWithEmptyValues,
  useDefaultLocaleCallback = true,
  ctx,
}) {
  const { userSession } = ctx.meta;
  validateLocationAndPluginAndLocale(locationName, pluginName, locale, true);
  await validateNotExistLocation({ locationName, pluginName, ctx });
  await validateNotExistSchema({ locationName, pluginName, ctx });

  const defaultLocale = await ctx.tx.call('users.platform.getDefaultLocale');

  try {
    await validateNotExistSchemaLocale({ locationName, pluginName, locale, ctx });
  } catch (err) {
    if (userSession) {
      locale = defaultLocale;
    } else {
      throw err;
    }
  }

  const promises = [
    getSchema({ locationName, pluginName, ctx }),
    getSchemaLocale({ locationName, pluginName, locale, ctx }),
  ];

  if (useDefaultLocaleCallback) {
    promises.push(getSchemaLocale({ locationName, pluginName, locale: defaultLocale, ctx }));
  }

  // eslint-disable-next-line prefer-const
  let [schema, schemaLocale, defaultSchemaLocale] = await Promise.all(promises);

  if (!useDefaultLocaleCallback) {
    defaultSchemaLocale = schemaLocale;
  }

  if (defaultWithEmptyValues) {
    _.forEach(getObjectArrayKeys(defaultSchemaLocale.schemaData), (key) => {
      _.set(defaultSchemaLocale.schemaData, key, '');
    });
    _.forEach(getObjectArrayKeys(defaultSchemaLocale.uiData), (key) => {
      _.set(defaultSchemaLocale.uiData, key, '');
    });
  }

  schema.schemaData = _.merge(defaultSchemaLocale.schemaData, schemaLocale.schemaData);
  schema.uiData = _.merge(defaultSchemaLocale.uiData, schemaLocale.uiData);

  schema.compileJsonSchema = squirrelly.render(
    JSON.stringify(schema.jsonSchema),
    schema.schemaData
  );
  schema.compileJsonUI = squirrelly.render(JSON.stringify(schema.jsonUI), schema.uiData);

  schema.compileJsonSchema = JSON.parse(
    schema.compileJsonSchema
      .replaceAll('"-*-*-[', '[')
      .replaceAll(']-*-*-"', ']')
      .replaceAll('"-*-*-{', '{')
      .replaceAll('}-*-*-"', '}')
  );
  schema.compileJsonUI = JSON.parse(
    schema.compileJsonUI
      .replaceAll('"-*-*-[', '[')
      .replaceAll(']-*-*-"', ']')
      .replaceAll('"-*-*-{', '{')
      .replaceAll('}-*-*-"', '}')
  );

  if (userSession) {
    const { goodKeys } = await getKeysCanAction({
      locationName,
      pluginName,
      userAgent: userSession.userAgents,
      actions: 'view',
      ctx,
    });
    const { goodKeys: editKeys } = await getKeysCanAction({
      locationName,
      pluginName,
      userAgent: userSession.userAgents,
      actions: 'edit',
      ctx,
    });

    // TODO Sacar los centros de los useragents y borrar todas las propiedades donde sus centro no esten entre los de los userAgents (El campo que tenga de entro el * siempre saldra)
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
