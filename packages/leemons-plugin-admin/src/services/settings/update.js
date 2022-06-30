const _ = require('lodash');
const { table } = require('../tables');
const findOne = require('./findOne');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function update(settings, { transacting: _transacting } = {}) {
  // TODO: Check why this.calledFrom from the plgin itself is not working
  let allowed = !this.calledFrom;

  if (
    this.calledFrom &&
    (this.calledFrom.startsWith('plugins.bulk-template') ||
      this.calledFrom.startsWith('plugins.admin'))
  ) {
    allowed = true;
  }

  if (allowed) {
    return global.utils.withTransaction(
      async (transacting) => {
        let currentSettings = await findOne({ transacting });
        if (_.isNil(currentSettings)) {
          currentSettings = await table.settings.create({ configured: false }, { transacting });
        }
        const newSettings = { ...currentSettings, ...settings };
        delete newSettings.id;

        return table.settings.update({ id: currentSettings.id }, newSettings, { transacting });
      },
      table.settings,
      _transacting
    );
  }

  throw new Error('This method can only be called from the plugins.admin');
}

module.exports = update;
