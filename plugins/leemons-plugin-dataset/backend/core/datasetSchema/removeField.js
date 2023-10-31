const _ = require('lodash');
const { getTranslationKey } = require('@leemons/multilanguage');
const { validateNotExistLocation } = require('../../validations/exists');
const getSchema = require('./getSchema');
const { transformJsonSchema, transformUiSchema } = require('./transformJsonOrUiSchema');
const updateSchema = require('./updateSchema');

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
async function removeField({ locationName, pluginName, item, ctx }) {
  await validateNotExistLocation({ locationName, pluginName, ctx });
  let dataset = await getSchema({ locationName, pluginName, ctx });
  delete dataset.jsonSchema.properties[item];
  delete dataset.jsonUI[item];
  const index = dataset.jsonSchema.required.indexOf(item);
  if (index >= 0) dataset.jsonSchema.required.splice(index, 1);
  dataset.jsonSchema = transformJsonSchema({ jsonSchema: dataset.jsonSchema }).json;
  dataset.jsonUI = transformUiSchema(dataset.jsonUI).json;

  dataset = await updateSchema({
    locationName,
    pluginName,
    jsonSchema: dataset.jsonSchema,
    jsonUI: dataset.jsonUI,
    ctx: { ...ctx, callerPlugin: pluginName },
  });

  const promises = [];
  promises.push(
    ctx.tx.call('multilanguage.contents.getLocaleValueWithKey', {
      key: getTranslationKey({ locationName, pluginName, key: 'jsonSchema', ctx }),
    })
  );
  promises.push(
    ctx.tx.call('multilanguage.contents.getLocaleValueWithKey', {
      key: getTranslationKey({ locationName, pluginName, key: 'jsonUI', ctx }),
    })
  );

  const [schema, ui] = await Promise.all(promises);

  const savePromises = [];
  _.forIn(schema, (value, locale) => {
    const jsonValue = JSON.parse(value || null);
    if (jsonValue && jsonValue.properties && jsonValue.properties[item]) {
      delete jsonValue.properties[item];
      savePromises.push(
        ctx.tx.call('multilanguage.contents.setValue', {
          key: getTranslationKey({ locationName, pluginName, key: 'jsonSchema', ctx }),
          locale,
          value: JSON.stringify(jsonValue),
        })
      );
    }
  });

  _.forIn(ui, (value, locale) => {
    const jsonValue = JSON.parse(value || null);
    delete jsonValue[item];
    savePromises.push(
      ctx.tx.call('multilanguage.contents.setValue', {
        key: getTranslationKey({ locationName, pluginName, key: 'jsonUI', ctx }),
        locale,
        value: JSON.stringify(jsonValue),
      })
    );
  });

  await Promise.all(savePromises);

  return dataset;
}

module.exports = removeField;
