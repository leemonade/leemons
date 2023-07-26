const { hasKey, setKey } = require('leemons-mongodb-helpers');
const { addLocales } = require('./addLocales');

async function addLocalesDeploy({ keyValueModel, locale, i18nPath, ctx }) {
  if (
    !(await hasKey(keyValueModel, `locale-${locale}-configured`)) ||
    process.env.RELOAD_I18N_ON_EVERY_INSTALL === 'true'
  ) {
    await addLocales({
      ctx,
      locales: locale,
      i18nPath,
    });
    await setKey(keyValueModel, `locale-${locale}-configured`);
  }
}

module.exports = { addLocalesDeploy };
