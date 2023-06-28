const _ = require('lodash');

async function addLocales({ locales: _locales, i18nPath, ctx }) {
  const locales = _.flattenDeep([_locales]);
  const localesData = {};

  for (let i = 0, len = locales.length; i < len; i++) {
    const locale = locales[i];
    try {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      localesData[locale] = require(`${i18nPath}/${locale}.js`);
    } catch (err) {
      ctx.logger.error(`Unable to load locale: ${i18nPath}`);
    }
  }

  return ctx.tx.call('multilanguage.common.setManyByJSON', {
    data: localesData,
  });
}

module.exports = { addLocales };
