const _ = require('lodash');
const { hasKey, setKey } = require('@leemons/mongodb-helpers');
const { addLocales } = require('./addLocales');

async function exec({ keyValueModel, locale, i18nPath, ctx }) {
  if (
    !(await hasKey(keyValueModel, `locale-${locale}-configured`)) ||
    process.env.RELOAD_I18N_ON_EVERY_INSTALL === 'true'
  ) {
    const { count } = await addLocales({
      ctx,
      locales: locale,
      i18nPath,
    });
    if (count) {
      await setKey(keyValueModel, `locale-${locale}-configured`);
    }
  }
}

async function addLocalesDeploy({ keyValueModel, locale, i18nPath, ctx }) {
  const locales = _.isArray(locale) ? locale : [locale];

  await Promise.all(_.map(locales, (l) => exec({ keyValueModel, locale: l, i18nPath, ctx })));
}

module.exports = { addLocalesDeploy };
