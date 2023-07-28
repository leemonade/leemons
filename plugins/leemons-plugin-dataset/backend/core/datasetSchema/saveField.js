const _ = require('lodash');
const { table } = require('../tables');
const { validateNotExistLocation } = require('../../validations/exists');
const getSchema = require('./getSchema');
const addSchema = require('./addSchema');
const { transformJsonSchema, transformUiSchema } = require('./transformJsonOrUiSchema');
const addSchemaLocale = require('../dataset-schema-locale/addSchemaLocale');
const existSchemaLocale = require('../dataset-schema-locale/existSchemaLocale');
const updateSchemaLocale = require('../dataset-schema-locale/updateSchemaLocale');
const updateSchema = require('./updateSchema');
const getSchemaWithLocale = require('./getSchemaWithLocale');
const recalculeEnumNames = require('./recalculeEnumNames');

async function saveLocale(
  locale,
  { schema, ui },
  locationName,
  pluginName,
  id,
  { transacting, useDefaultLocaleCallback = true } = {}
) {
  if (await existSchemaLocale(locationName, pluginName, locale, { transacting })) {
    const { compileJsonSchema, compileJsonUI } = await getSchemaWithLocale.call(
      { calledFrom: pluginName },
      locationName,
      pluginName,
      locale,
      { transacting, useDefaultLocaleCallback }
    );

    compileJsonSchema.properties[id] = schema;
    compileJsonUI[id] = ui;

    const _schema = transformJsonSchema(compileJsonSchema);
    const _ui = transformUiSchema(compileJsonUI);

    return updateSchemaLocale.call(
      { calledFrom: pluginName },
      {
        schemaData: _schema.values,
        uiData: _ui.values,
        locationName,
        locale,
        pluginName,
      },
      { transacting }
    );
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
  const _schema = transformJsonSchema(jsonSchema);
  const _ui = transformUiSchema(jsonUI);
  return addSchemaLocale.call(
    { calledFrom: pluginName },
    {
      schemaData: _schema.values,
      uiData: _ui.values,
      locationName,
      locale,
      pluginName,
    },
    { transacting }
  );
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
async function saveField(
  locationName,
  pluginName,
  schemaConfig,
  schemaLocales,
  { useDefaultLocaleCallback = true, transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistLocation(locationName, pluginName, { transacting });

      let id;
      let dataset = null;
      try {
        dataset = await getSchema(locationName, pluginName, { transacting });

        id = schemaConfig.schema.id ? schemaConfig.schema.id : global.utils.randomString();

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

        dataset.jsonSchema = transformJsonSchema(dataset.jsonSchema).json;
        dataset.jsonUI = transformUiSchema(dataset.jsonUI).json;

        dataset = await updateSchema.call(
          { calledFrom: pluginName },
          {
            locationName,
            pluginName,
            jsonSchema: dataset.jsonSchema,
            jsonUI: dataset.jsonUI,
          },
          { transacting }
        );
      } catch (e) {
        if (e.code === 4001) {
          // ES: Creamos el schema por que aun no existe
          id = global.utils.randomString();
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
          jsonSchema = transformJsonSchema(jsonSchema).json;
          jsonUI = transformUiSchema(jsonUI).json;

          dataset = await addSchema.call(
            { calledFrom: pluginName },
            {
              locationName,
              pluginName,
              jsonSchema,
              jsonUI,
            },
            { transacting }
          );
        } else {
          throw e;
        }
      }

      // ES: Traducciones
      const promises = [];
      _.forIn(schemaLocales, (value, locale) => {
        promises.push(
          saveLocale(locale, value, locationName, pluginName, id, {
            transacting,
            useDefaultLocaleCallback,
          })
        );
      });
      await Promise.all(promises);

      // Vamos coger el schema tocho, que tiene que tener los checkboxs guays y recorrernos todas las traducciones calculando el enumNames
      await recalculeEnumNames(locationName, pluginName, { transacting });

      await leemons.events.emit('save-field', {
        locationName,
        pluginName,
        transacting,
      });

      return dataset;
    },
    table.dataset,
    _transacting
  );
}

module.exports = saveField;
