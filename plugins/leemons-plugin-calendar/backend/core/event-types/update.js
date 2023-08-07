const { table } = require('../tables');
const { validateKeyPrefix, validateNotExistEventTypeKey } = require('../../validations/exists');

/**
 * Update event type with the provided key if not already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {string} url - Frontend url
 * @param {any?} options - Additional options
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function update(key, url, options = {}, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistEventTypeKey(key, { transacting });
      delete options.id;
      delete options.key;
      delete options.pluginName;
      return table.eventTypes.update({ key }, { ...options, url }, { transacting });
    },
    table.eventTypes,
    _transacting
  );
}

module.exports = { update };
