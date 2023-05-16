const { getTranslationKey, translations } = require('../translations');
const {
  validateNotExistSchemaLocale,
  validateNotExistSchema,
  validateNotExistLocation,
  validatePluginName,
} = require('../../validations/exists');
const { validateLocationAndPluginAndLocale } = require('../../validations/dataset-location');
const { table } = require('../tables');

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
async function deleteSchemaLocale({ locationName, pluginName, locale }, { transacting } = {}) {
  validateLocationAndPluginAndLocale(locationName, pluginName, locale, true);
  validatePluginName(pluginName, this.calledFrom);
  await validateNotExistLocation(locationName, pluginName, { transacting });
  await validateNotExistSchema(locationName, pluginName, { transacting });
  await validateNotExistSchemaLocale(locationName, pluginName, locale, { transacting });

  return global.utils.withTransaction(
    async (_transacting) => {
      await Promise.all([
        translations().contents.delete(
          getTranslationKey(locationName, pluginName, 'jsonSchema'),
          locale,
          { transacting: _transacting }
        ),
        translations().contents.delete(
          getTranslationKey(locationName, pluginName, 'jsonUI'),
          locale,
          { transacting: _transacting }
        ),
      ]);

      return true;
    },
    table.dataset,
    transacting
  );
}

module.exports = deleteSchemaLocale;
