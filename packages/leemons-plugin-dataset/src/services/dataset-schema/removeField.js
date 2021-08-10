const _ = require('lodash');
const { table } = require('../tables');
const { validateNotExistLocation } = require('../../validations/exists');

/** *
 *  ES:
 *  Elimina un campo al schema
 *
 *  EN:
 *  Remove one field to schema
 *
 *  @public
 *  @static
 *  @param {any=} _transacting - DB Transaction
 *  @return {Promise<DatasetSchema>} The new dataset location
 *  */
async function removeField(locationName, pluginName, item, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistLocation(locationName, pluginName, { transacting });
    },
    table.dataset,
    _transacting
  );
}

module.exports = removeField;
