const {
  validatePluginName,
  validateNotExistLocation,
  validateNotExistSchema,
  validateNotExistSchemaLocale,
} = require('../../validations/exists');
const { validateAddSchemaLocale } = require('../../validations/dataset-schema-locale');
const { getTranslationKey, translations } = require('../translations');
const { table } = require('../tables');

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
async function updateSchemaLocale(
  { locationName, pluginName, schemaData, uiData, locale },
  { transacting } = {}
) {
  validateAddSchemaLocale({ locationName, pluginName, schemaData, uiData, locale });
  validatePluginName(pluginName, this.calledFrom);
  await validateNotExistLocation(locationName, pluginName, { transacting });
  await validateNotExistSchema(locationName, pluginName, { transacting });
  await validateNotExistSchemaLocale(locationName, pluginName, locale, { transacting });

  return global.utils.withTransaction(
    async (_transacting) => {
      await Promise.all([
        translations().contents.setValue(
          getTranslationKey(locationName, pluginName, 'jsonSchema'),
          locale,
          JSON.stringify(schemaData),
          { transacting: _transacting }
        ),
        translations().contents.setValue(
          getTranslationKey(locationName, pluginName, 'jsonUI'),
          locale,
          JSON.stringify(uiData),
          { transacting: _transacting }
        ),
      ]);
      return { locationName, pluginName, schemaData, uiData, locale };
    },
    table.dataset,
    transacting
  );
}

module.exports = updateSchemaLocale;
