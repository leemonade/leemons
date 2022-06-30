const _ = require('lodash');
const { table } = require('../tables');
const { validateNotExistLocation } = require('../../validations/exists');
const getSchema = require('./getSchema');
const { transformJsonSchema, transformUiSchema } = require('./transformJsonOrUiSchema');
const updateSchema = require('./updateSchema');
const { translations, getTranslationKey } = require('../translations');

/** *
 *  ES:
 *  Elimina un campo al schema
 *
 *  EN:
 *  Remove one field to schema
 *
 *  @public
 *  @static
 *  @param {string} locationName - Location name
 *  @param {string} pluginName - Plugin name
 *  @param {string} item - Generated item id
 *  @param {any=} _transacting - DB Transaction
 *  @return {Promise<DatasetSchema>} The new dataset location
 *  */
async function removeField(locationName, pluginName, item, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistLocation(locationName, pluginName, { transacting });
      let dataset = await getSchema(locationName, pluginName, { transacting });
      delete dataset.jsonSchema.properties[item];
      delete dataset.jsonUI[item];
      const index = dataset.jsonSchema.required.indexOf(item);
      if (index >= 0) dataset.jsonSchema.required.splice(index, 1);
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

      const promises = [];
      promises.push(
        translations().contents.getLocaleValueWithKey(
          getTranslationKey(locationName, pluginName, 'jsonSchema'),
          { transacting }
        )
      );
      promises.push(
        translations().contents.getLocaleValueWithKey(
          getTranslationKey(locationName, pluginName, 'jsonUI'),
          { transacting }
        )
      );

      const [schema, ui] = await Promise.all(promises);

      const savePromises = [];
      _.forIn(schema, (value, locale) => {
        const jsonValue = JSON.parse(value);
        if (jsonValue && jsonValue.properties && jsonValue.properties[item]) {
          delete jsonValue.properties[item];
          savePromises.push(
            translations().contents.setValue(
              getTranslationKey(locationName, pluginName, 'jsonSchema'),
              locale,
              JSON.stringify(jsonValue),
              { transacting }
            )
          );
        }
      });

      _.forIn(ui, (value, locale) => {
        const jsonValue = JSON.parse(value);
        delete jsonValue[item];
        savePromises.push(
          translations().contents.setValue(
            getTranslationKey(locationName, pluginName, 'jsonUI'),
            locale,
            JSON.stringify(jsonValue),
            { transacting }
          )
        );
      });

      await Promise.all(savePromises);

      return dataset;
    },
    table.dataset,
    _transacting
  );
}

module.exports = removeField;
