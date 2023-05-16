const { isEmpty, isString } = require('lodash');
const { table } = require('../tables');
const findOne = require('./findOne');
const update = require('./update');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function setDefaultLanguage(lang, { transacting: _transacting } = {}) {
  if (!lang || !isString(lang) || isEmpty(lang)) {
    throw new Error('Language is required');
  }

  return global.utils.withTransaction(
    async (transacting) => {
      const currentSettings = await findOne({ transacting });
      if (currentSettings && currentSettings.configured) {
        throw new Error('Settings already configured');
      }

      const { services: userService } = leemons.getPlugin('users');

      await userService.platform.setDefaultLocale(lang);

      return update(
        {
          ...(currentSettings || {}),
          lang,
        },
        { transacting }
      );
    },
    table.settings,
    _transacting
  );
}

module.exports = setDefaultLanguage;
