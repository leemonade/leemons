const _ = require('lodash');
const locale = require('locale-codes');

const localesTable = leemons.query('plugins_multilanguage::locales');

const es = require('./src/i18n/es');
const en = require('./src/i18n/en');

const { isValidLocaleCode } = require('./src/validations/locale');
const Locales = require('./src/services/locale');

async function init() {
  try {
    const goodLocales = _.map(
      locale.all.filter((local) => isValidLocaleCode(local.tag)),
      (local) => {
        let name = local.local || local.name;
        if (local.location) {
          name += ` (${local.location})`;
        }
        return [local.tag, name];
      }
    );

    const locales = new Locales({ model: localesTable });
    if (!(await locales.has(_.last(goodLocales)[0]))) {
      await locales.addMany(goodLocales);
    }
  } catch (err) {
    console.error(err);
  }

  await leemons.plugin.services.common.getProvider().setManyByJSON(
    {
      es,
      en,
    },
    leemons.plugin.prefixPN('')
  );
}

module.exports = init;
