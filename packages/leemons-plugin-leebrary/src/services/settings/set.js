const { isNil } = require('lodash');
const { tables } = require('../tables');
const { findOne } = require('./findOne');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function set(settings, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      let currentSettings = await findOne({ transacting });
      if (isNil(currentSettings)) {
        currentSettings = await tables.settings.create({}, { transacting });
      }
      const newSettings = { ...currentSettings, ...settings };
      delete newSettings.id;

      return tables.settings.update({ id: currentSettings.id }, newSettings, { transacting });
    },
    tables.settings,
    _transacting
  );
}

module.exports = { set };
