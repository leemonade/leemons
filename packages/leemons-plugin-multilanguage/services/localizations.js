const LocalizationProvider = require('../src/services/localization');

const localizationsTable = leemons.query('plugins_multilanguage::localizations');

module.exports = new LocalizationProvider(localizationsTable);
