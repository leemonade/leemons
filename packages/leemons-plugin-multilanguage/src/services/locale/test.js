const localizationsTable = leemons.query('plugins_multilanguage::localizations');
const localesTable = leemons.query('plugins_multilanguage::locales');

const locales = require('.');

module.exports = async () => {
  leemons.log.debug('Initializing test');
  leemons.log.debug('This must be moved to jest', { labels: ['warning'] });

  await localizationsTable.deleteMany({ id_$ne: 0 });
  await localesTable.deleteMany({ id_$ne: 0 });
};
