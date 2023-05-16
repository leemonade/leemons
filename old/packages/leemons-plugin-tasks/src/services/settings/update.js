const _ = require('lodash');
const table = require('../table');
const findOne = require('./findOne');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function update(settings, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      let currentSettings = await findOne({ transacting });
      if (_.isNil(currentSettings)) {
        currentSettings = await table.settings.create(
          { hideWelcome: false, configured: false },
          { transacting }
        );
      }
      const newSettings = { ...currentSettings, ...settings };
      delete newSettings.id;

      return table.settings.update({ id: currentSettings.id }, newSettings, { transacting });
    },
    table.settings,
    _transacting
  );
}

module.exports = update;
