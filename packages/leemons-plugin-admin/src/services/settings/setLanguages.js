/* eslint-disable global-require */
const { flattenDeep, isEmpty, isString } = require('lodash');
const { table } = require('../tables');
const findOne = require('./findOne');
const update = require('./update');
const { STATUS } = require('../../../config/constants');
// const { addLocales } = require('../locales/addLocales');

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
      const currentLocales = await userService.platform.getLocales({ transacting });

      console.log('currentLocales:');
      console.dir(currentLocales, { depth: null });

      const localesToAdd = locales.filter(
        (locale) => !currentLocales.find((l) => l.code === locale.code)
      );

      console.log('localesToAdd:');
      console.dir(localesToAdd, { depth: null });

      const localesToRemove = currentLocales.filter(
        (locale) => !locales.find((l) => l.code === locale.code)
      );

      console.log('localesToRemove:');
      console.dir(localesToRemove, { depth: null });

      const localesAdded = await Promise.all(
        localesToAdd.map((lang) => userService.platform.addLocale(lang.code, lang.name))
      );

      // await addLocales(localesAdded.map((locale) => locale.code));

      if (defaultLang && isString(defaultLang) && !isEmpty(defaultLang)) {
        await userService.platform.setDefaultLocale(defaultLang);
      }

      return update.call(
        this,
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
