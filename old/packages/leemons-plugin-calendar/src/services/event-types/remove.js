const { table } = require('../tables');
const { validateKeyPrefix, validateNotExistEventTypeKey } = require('../../validations/exists');

/**
 * Remove event type with the provided key
 * @public
 * @static
 * @param {string} key - key
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function remove(key, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistEventTypeKey(key, { transacting });
      return table.eventTypes.delete({ key }, { transacting });
    },
    table.eventTypes,
    _transacting
  );
}

module.exports = { remove };
