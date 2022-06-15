/* eslint-disable global-require */
const path = require('path');
const { flattenDeep, isEmpty, isString } = require('lodash');
const { table } = require('../tables');
const findOne = require('./findOne');
const update = require('./update');
const { STATUS } = require('../../../config/constants');
const { translations } = require('../translations');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function setLanguages(langs, defaultLang, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const currentSettings = await findOne({ transacting });
      if (currentSettings && currentSettings.configured) {
        throw new Error('Settings already configured');
      }

      const { services: userService } = leemons.getPlugin('users');
      const locales = flattenDeep([langs]);

      const localesAdded = await Promise.all(
        locales.map((lang) => userService.platform.addLocale(lang.code, lang.name))
      );

      if (translations()) {
        const localesData = {};

        for (let i = 0, len = localesAdded.length; i < len; i++) {
          const locale = localesAdded[i];
          // eslint-disable-next-line no-await-in-loop
          localesData[locale.code] = await leemons.fs.readFile(
            path.resolve(__dirname, `../../i18n/${locale.code}.json`),
            'utf8'
          );
          localesData[locale.code] = JSON.parse(localesData[locale.code]);
        }

        await translations().common.setManyByJSON(localesData, leemons.plugin.prefixPN(''));
      }

      if (defaultLang && isString(defaultLang) && !isEmpty(defaultLang)) {
        await userService.platform.setDefaultLocale(defaultLang);
      }

      return update(
        {
          ...(currentSettings || {}),
          lang: defaultLang || currentSettings?.lang || 'en',
          status:
            currentSettings?.status === STATUS.NONE
              ? STATUS.LOCALIZED
              : currentSettings?.status || STATUS.LOCALIZED,
        },
        { transacting }
      );
    },
    table.settings,
    _transacting
  );
}

module.exports = setLanguages;
