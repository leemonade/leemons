const i18n = require('../../i18n');

module.exports = async function initMultilanguage() {
  const multilanguageCommon = leemons.getPlugin('multilanguage').services.common.getProvider();

  await multilanguageCommon.setManyByJSON(i18n, leemons.plugin.prefixPN(''));
};
