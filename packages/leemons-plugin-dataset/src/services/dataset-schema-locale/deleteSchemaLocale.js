const { getTranslationKey, translations } = require('../translations');

const existLocation = require('../dataset-location/existLocation');
const existSchema = require('../dataset-schema/existSchema');
const existSchemaLocale = require('./existSchemaLocale');
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
