/* eslint-disable no-await-in-loop */
const { keys } = require('lodash');
const importLocales = require('./bulk/locales');

async function initLocales({ file, ctx }) {
  try {
    const locales = await importLocales(file);
    const itemKeys = keys(locales);

    for (let i = 0, len = itemKeys.length; i < len; i++) {
      const itemKey = itemKeys[i];
      const { code, name } = locales[itemKey];
      const localeData = await ctx.call('users.platform.addLocale', {
        locale: code,
        name,
      });

      locales[itemKey] = localeData;
    }

    await ctx.call('admin.settings.update', { status: 'LOCALIZED' });

    return locales;
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

module.exports = initLocales;
