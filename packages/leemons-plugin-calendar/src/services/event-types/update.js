const { table } = require('../tables');
const { validateKeyPrefix, validateNotExistEventTypeKey } = require('../../validations/exists');

/**
 * Update event type with the provided key if not already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {string} url - Frontend url
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function update(key, url, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistEventTypeKey(key, { transacting });
      return table.eventTypes.update({ key }, { url }, { transacting });
    },
    table.eventTypes,
    _transacting
  );
}

module.exports = { update };
