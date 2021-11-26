const { table } = require('../tables');
const { validateKeyPrefix, validateExistEventTypeKey } = require('../../validations/exists');

/**
 * Add event type with the provided key if not already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {string} url - Frontend url
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function add(key, url, { transacting: _transacting } = {}) {
  validateKeyPrefix(key, this.calledFrom);

  return global.utils.withTransaction(
    async (transacting) => {
      await validateExistEventTypeKey(key, { transacting });
      return table.eventTypes.create(
        { key, url, pluginName: this.calledFrom.replace('plugins.', '') },
        { transacting }
      );
    },
    table.eventTypes,
    _transacting
  );
}

module.exports = { add };
