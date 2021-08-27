const es = require('./src/i18n/es');
const en = require('./src/i18n/en');
const { translations } = require('./src/translations');

async function init() {
  try {
    if (translations()) {
      await translations().common.setManyByJSON(
        {
          es,
          en,
        },
        leemons.plugin.prefixPN('')
      );
    }
  } catch (e) {
    console.error(e);
  }
}

module.exports = init;
