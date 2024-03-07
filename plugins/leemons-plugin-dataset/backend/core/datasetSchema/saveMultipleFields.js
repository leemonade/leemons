const _ = require('lodash');
const saveField = require('./saveField');

/** *
 *  ES:
 *  Añade o actualiza multiples campos al schema
 *
 *  EN:
 *  Add or update multiple fields to schema
 *
 *  @public
 *  @static
 *  @param {any=} _transacting - DB Transaction
 *  @return {Promise<DatasetSchema>} The new dataset location
 *  */
async function saveMultipleFields({ locationName, pluginName, fields, ctx }) {
  let response = null;
  for (let i = 0, l = fields.length; i < l; i++) {
    // ES: Como saveField devuelve el dataset solo necesitamos el ultimo guardado
    response = await saveField({
      locationName,
      pluginName,
      schemaConfig: fields[i].schemaConfig,
      schemaLocales: fields[i].schemaLocale,
      ctx,
    });
  }
  return response;
}

module.exports = saveMultipleFields;
