const existLocation = require('../dataset-location/existLocation');
const existSchema = require('../dataset-schema/existSchema');
const existSchemaLocale = require('./existSchemaLocale');
const { getTranslationKey } = require('../translations');
const { translations } = require('../translations');
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
  if (pluginName !== this.calledFrom) throw new Error(`The plugin name must be ${this.calledFrom}`);
  if (!(await existLocation(locationName, pluginName, { transacting })))
    throw new Error(`The '${locationName}' location not exist`);
  if (!(await existSchema(locationName, pluginName, { transacting })))
    throw new Error(`The schema for '${locationName}' location not exist`);
  if (!(await existSchemaLocale(locationName, pluginName, 'jsonSchema', locale, { transacting })))
    throw new Error(`"${locale}" language data for "${locationName}" localization not exists.`);
  if (!(await existSchemaLocale(locationName, pluginName, 'jsonUI', locale, { transacting })))
    throw new Error(`"${locale}" language data for "${locationName}" localization not exists.`);

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
      return {
        schemaData,
        uiData,
      };
    },
    table.dataset,
    transacting
  );
}

module.exports = updateSchemaLocale;
