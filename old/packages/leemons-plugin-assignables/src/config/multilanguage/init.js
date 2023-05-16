const { addLocales } = require('../../services/locales/addLocales');

module.exports = async function initMultilanguage() {
  await addLocales(['en', 'es']);
};
