const { getTranslationKey } = require('@leemons/multilanguage');
const {
  validateExistSchemaLocale,
  validateNotExistSchema,
  validateNotExistLocation,
  validatePluginName,
} = require('../../validations/exists');
const { validateAddSchemaLocale } = require('../../validations/datasetSchemaLocale');

/** *
 *  ES:
 *  Añade los datos de en un idioma a un schema ya existente, si no existe el schema lanza un error
 *
 *  EN:
 *  Adds the data in a language to an existing schema, if the schema does not exist it throws an error.
 *
 *  @public
 *  @static
 *  @param {DatasetAddSchemaLocale} data - New data for schema locale
 *  @param {any=} transacting - DB Transaction
 *  @return {Promise<{schemaData, uiData}>} The json data passed
 *  */
async function addSchemaLocale({ locationName, pluginName, schemaData, uiData, locale, ctx }) {
  validateAddSchemaLocale({ locationName, pluginName, schemaData, uiData, locale });
  validatePluginName({ pluginName, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistLocation({ locationName, pluginName, ctx });
  await validateNotExistSchema({ locationName, pluginName, ctx });
  await validateExistSchemaLocale({ locationName, pluginName, locale, ctx });

  await Promise.all([
    ctx.tx.call('multilanguage.contents.add', {
      key: getTranslationKey({ locationName, pluginName, key: 'jsonSchema', ctx }),
      locale,
      value: JSON.stringify(schemaData),
    }),
    ctx.tx.call('multilanguage.contents.add', {
      key: getTranslationKey({ locationName, pluginName, key: 'jsonUI', ctx }),
      locale,
      value: JSON.stringify(uiData),
    }),
  ]);
  return {
    locationName,
    pluginName,
    schemaData,
    uiData,
    locale,
  };
}

module.exports = addSchemaLocale;
