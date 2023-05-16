/* eslint-disable no-await-in-loop */
const { keys } = require('lodash');
const importLocales = require('./bulk/locales');

async function initLocales(file) {
  const { services } = leemons.getPlugin('users');

  try {
    const locales = await importLocales(file);
    const itemKeys = keys(locales);

    for (let i = 0, len = itemKeys.length; i < len; i++) {
      const itemKey = itemKeys[i];
      const { code, name } = locales[itemKey];
      const localeData = await services.platform.addLocale(code, name);

      locales[itemKey] = localeData;
    }

    await leemons.getPlugin('admin').services.settings.update({ status: 'LOCALIZED' });

    return locales;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initLocales;
