/* eslint-disable no-await-in-loop */
const { keys } = require('lodash');
const importLocales = require('./bulk/locales');

async function initLocales() {
  const { services } = leemons.getPlugin('users');

  try {
    const locales = await importLocales();
    const itemKeys = keys(locales);

    for (let i = 0, len = itemKeys.length; i < len; i++) {
      const itemKey = itemKeys[i];
      const { code, name, default: isDefault } = locales[itemKey];
      const localeData = await services.platform.addLocale(code, name);

      if (isDefault) {
        await services.platform.setDefaultLocale(code);
      }
      locales[itemKey] = localeData;
    }

    console.log('------ LOCALES ------');
    console.dir(locales, { depth: null });

    await leemons.getPlugin('admin').services.settings.update({ status: 'LOCALIZED' });

    return locales;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initLocales;
