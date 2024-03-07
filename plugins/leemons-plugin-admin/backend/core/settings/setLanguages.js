/* eslint-disable no-unused-vars */
/* eslint-disable global-require */
const { flattenDeep, isEmpty, isString } = require('lodash');
const findOne = require('./findOne');
const update = require('./update');
const { STATUS } = require('../../config/constants');

// const { addLocales } = require('../locales/addLocales');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function setLanguages({ langs, defaultLang, removeOthers, ctx }) {
  const currentSettings = await findOne({ ctx });

  const locales = flattenDeep([langs]);
  const currentLocales = await ctx.tx.call('users.platform.getLocales');

  const localesToAdd = locales.filter(
    (locale) => !currentLocales.find((l) => l.code === locale.code)
  );

  const localesToRemove = currentLocales.filter(
    (locale) => !locales.find((l) => l.code === locale.code)
  );
  const localesAdded = await Promise.all(
    localesToAdd.map((lang) =>
      ctx.tx.call('users.platform.addLocale', { locale: lang.code, name: lang.name })
    )
  );

  if (removeOthers) {
    await Promise.all(
      localesToRemove.map((locale) =>
        ctx.tx.call('users.platform.removeLocale', { locale: locale.code })
      )
    );
  }

  // await addLocales(localesAdded.map((locale) => locale.code));

  if (!currentSettings || !currentSettings.configured) {
    if (defaultLang && isString(defaultLang) && !isEmpty(defaultLang)) {
      await ctx.tx.call('users.platform.setDefaultLocale', { value: defaultLang });
    }
  }

  return update({
    ...(currentSettings || {}),
    lang: defaultLang || currentSettings?.lang || 'en',
    status:
      currentSettings?.status === STATUS.NONE
        ? STATUS.LOCALIZED
        : currentSettings?.status || STATUS.LOCALIZED,
    ctx,
  });
}

module.exports = setLanguages;
