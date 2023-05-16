const _ = require('lodash');
const { table } = require('../tables');
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
async function saveMultipleFields(
  locationName,
  pluginName,
  fields,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      let response = null;
      for (let i = 0, l = fields.length; i < l; i++) {
        // ES: Como saveField devuelve el dataset solo necesitamos el ultimo guardado
        response = await saveField(
          locationName,
          pluginName,
          fields[i].schemaConfig,
          fields[i].schemaLocales,
          { transacting }
        );
      }
      return response;
    },
    table.dataset,
    _transacting
  );
}

module.exports = saveMultipleFields;
