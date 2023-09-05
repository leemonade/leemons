const {
  validatePluginName,
  validateNotExistLocation,
  validateNotExistSchema,
  validateNotExistSchemaLocale,
} = require('../../validations/exists');
const { validateAddSchemaLocale } = require('../../validations/datasetSchemaLocale');
const { getTranslationKey } = require('leemons-multilanguage');

/** *
 *  ES:
 *  Añade los datos en un idioma a un schema ya existente, si no existe el schema lanza un error
 *
 *  EN:
 *  Adds the data in a language to an existing schema, if the schema does not exist it throws an error.
 *
 *  @public
 *  @static
 *  @param {DatasetAddSchemaLocale} data
 *  @param {any=} transacting - DB Transaction
 *  @return {Promise<{schemaData, uiData}>} The json data passed
 *  */
async function updateSchemaLocale({ locationName, pluginName, schemaData, uiData, locale, ctx }) {
  validateAddSchemaLocale({ locationName, pluginName, schemaData, uiData, locale });
  validatePluginName({ pluginName, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistLocation({ locationName, pluginName, ctx });
  await validateNotExistSchema({ locationName, pluginName, ctx });
  await validateNotExistSchemaLocale({ locationName, pluginName, locale, ctx });

  await Promise.all([
    ctx.tx.call('multilanguage.contents.setValue', {
      key: getTranslationKey({ locationName, pluginName, key: 'jsonSchema', ctx }),
      locale,
      value: JSON.stringify(schemaData),
    }),
    ctx.tx.call('multilanguage.contents.setValue', {
      key: getTranslationKey({ locationName, pluginName, key: 'jsonUI', ctx }),
      locale,
      value: JSON.stringify(schemaData),
    }),
  ]);
  return { locationName, pluginName, schemaData, uiData, locale };
}

module.exports = updateSchemaLocale;
