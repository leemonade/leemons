const LocalizationProvider = require('../src/services/localization');

const localizationsTable = leemons.query('plugins_multilanguage::contents');

module.exports = new LocalizationProvider(localizationsTable);
