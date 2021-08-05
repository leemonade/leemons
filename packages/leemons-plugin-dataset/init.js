const es = require('./src/i18n/es');
const en = require('./src/i18n/en');
const { translations } = require('./src/services/translations');
const { ca } = require('wait-on/exampleConfig');
const _ = require('lodash');
const constants = require('./config/constants');

async function init() {
  if (translations()) {
    await translations().common.setManyByJSON(
      {
        es,
        en,
      },
      leemons.plugin.prefixPN('')
    );
  }
}

module.exports = init;
