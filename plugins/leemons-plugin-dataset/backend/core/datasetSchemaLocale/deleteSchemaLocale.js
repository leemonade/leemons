const { getTranslationKey } = require('@leemons/multilanguage');
const {
  validateNotExistSchemaLocale,
  validateNotExistSchema,
  validateNotExistLocation,
  validatePluginName,
} = require('../../validations/exists');
const { validateLocationAndPluginAndLocale } = require('../../validations/datasetLocation');

/** *
 *  ES:
 *  Elimina los datos de una traduccion para un schema
 *
 *  EN:
 *  Removes the data from a translation for a schema
 *
 *  @public
 *  @static
 *  @param {DatasetDeleteSchemaLocale} data
 *  @param {any=} transacting - DB Transaction
 *  @return {Promise<boolean>} Return true if delete is ok
 *  */
async function deleteSchemaLocale({ locationName, pluginName, locale, ctx }) {
  validateLocationAndPluginAndLocale(locationName, pluginName, locale, true);
  validatePluginName({ pluginName, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistLocation({ locationName, pluginName, ctx });
  await validateNotExistSchema({ locationName, pluginName, ctx });
  await validateNotExistSchemaLocale({ locationName, pluginName, locale, ctx });

  await Promise.all([
    ctx.tx.call('multilanguage.contents.delete', {
      key: getTranslationKey({ locationName, pluginName, key: 'jsonSchema', ctx }),
      locale,
    }),
    ctx.tx.call('multilanguage.contents.delete', {
      key: getTranslationKey({ locationName, pluginName, key: 'jsonUI', ctx }),
      locale,
    }),
  ]);

  return true;
}

module.exports = deleteSchemaLocale;
