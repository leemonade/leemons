const _ = require('lodash');
const { validateNotExistLocation } = require('../../validations/exists');
const getSchema = require('./getSchema');
const addSchema = require('./addSchema');
const { transformJsonSchema, transformUiSchema } = require('./transformJsonOrUiSchema');
const addSchemaLocale = require('../datasetSchemaLocale/addSchemaLocale');
const existSchemaLocale = require('../datasetSchemaLocale/existSchemaLocale');
const updateSchemaLocale = require('../datasetSchemaLocale/updateSchemaLocale');
const updateSchema = require('./updateSchema');
const getSchemaWithLocale = require('./getSchemaWithLocale');
const recalculeEnumNames = require('./recalculeEnumNames');
const { randomString } = require('leemons-utils');

async function saveLocale({
  locale,
  value: { schema, ui },
  locationName,
  pluginName,
  id,
  useDefaultLocaleCallback = true,
  ctx,
}) {
  if (await existSchemaLocale({ locationName, pluginName, locale, ctx })) {
    const { compileJsonSchema, compileJsonUI } = await getSchemaWithLocale({
      locationName,
      pluginName,
      locale,
      useDefaultLocaleCallback,
      ctx: {
        ...ctx,
        callerPlugin: pluginName,
      },
    });

    compileJsonSchema.properties[id] = schema;
    compileJsonUI[id] = ui;

    const _schema = transformJsonSchema({ jsonSchema: compileJsonSchema });
    const _ui = transformUiSchema(compileJsonUI);

    return updateSchemaLocale({
      schemaData: _schema.values,
      uiData: _ui.values,
      locationName,
      locale,
      pluginName,
      ctx: {
        ...ctx,
        callerPlugin: pluginName,
      },
    });
  }
  const jsonSchema = {
    type: 'object',
    properties: {
      [id]: schema,
    },
    required: [],
  };
  const jsonUI = {
    [id]: ui,
  };
  const _schema = transformJsonSchema({ jsonSchema });
  const _ui = transformUiSchema(jsonUI);
  return addSchemaLocale({
    schemaData: _schema.values,
    uiData: _ui.values,
    locationName,
    locale,
    pluginName,
    ctx: {
      ...ctx,
      callerPlugin: pluginName,
    },
  });
}

/** *
 *  ES:
 *  Añade o actualiza un campo al schema
 *
 *  EN:
 *  Add or update one field to schema
 *
 *  @public
 *  @static
 *  @param {any=} _transacting - DB Transaction
 *  @return {Promise<DatasetSchema>} The new dataset location
 *  */
async function saveField({
  locationName,
  pluginName,
  schemaConfig,
  schemaLocales,
  useDefaultLocaleCallback = true,
  ctx,
}) {
  await validateNotExistLocation({ locationName, pluginName, ctx });

  let id;
  let dataset = null;
  try {
    dataset = await getSchema({ locationName, pluginName, ctx });

    id = schemaConfig.schema.id ? schemaConfig.schema.id : randomString();

    dataset.jsonSchema.properties[id] = {
      ...schemaConfig.schema,
      id,
    };
    dataset.jsonUI[id] = schemaConfig.ui;

    dataset.jsonSchema.required = [];

    _.forIn(dataset.jsonSchema.properties, (value, key) => {
      if (value.frontConfig.required) {
        dataset.jsonSchema.required.push(key);
      }
    });

    dataset.jsonSchema = transformJsonSchema({ jsonSchema: dataset.jsonSchema }).json;
    dataset.jsonUI = transformUiSchema(dataset.jsonUI).json;

    dataset = await updateSchema({
      locationName,
      pluginName,
      jsonSchema: dataset.jsonSchema,
      jsonUI: dataset.jsonUI,
      ctx: {
        ...ctx,
        callerPlugin: pluginName,
      },
    });
  } catch (e) {
    if (e.code === 4001) {
      // ES: Creamos el schema por que aun no existe
      id = randomString();
      let jsonSchema = {
        type: 'object',
        properties: {
          [id]: schemaConfig.schema,
        },
        required: [],
      };
      schemaConfig.schema.id = id;
      if (schemaConfig.schema.frontConfig.required) {
        jsonSchema.required.push(id);
      }
      // ES: Creamos el ui por que aun no existe
      let jsonUI = {
        [id]: schemaConfig.ui,
      };

      // ES: Transforma los json finales a lo que necesitamos almacenar
      jsonSchema = transformJsonSchema({ jsonSchema }).json;
      jsonUI = transformUiSchema(jsonUI).json;

      dataset = await addSchema({
        locationName,
        pluginName,
        jsonSchema,
        jsonUI,
        ctx: {
          ...ctx,
          callerPlugin: pluginName,
        },
      });
    } else {
      throw e;
    }
  }

  // ES: Traducciones
  const promises = [];
  _.forIn(schemaLocales, (value, locale) => {
    promises.push(
      saveLocale({
        locale,
        value,
        locationName,
        pluginName,
        id,
        useDefaultLocaleCallback,
        ctx,
      })
    );
  });
  await Promise.all(promises);

  // Vamos coger el schema tocho, que tiene que tener los checkboxs guays y recorrernos todas las traducciones calculando el enumNames
  await recalculeEnumNames({ locationName, pluginName, ctx });

  await ctx.emit('save-field', {
    locationName,
    pluginName,
  });

  return dataset;
}

module.exports = saveField;
