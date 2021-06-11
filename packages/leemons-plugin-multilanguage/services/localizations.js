const localizations = require('../src/services/localization');

localizations
  .addManyByKey('message.greet', {
    en: 'Hello',
    es: 'Hola',
    fr: 'Bonjour',
  })
  .then((r) => {
    console.log('OK:', r);
  })
  .catch((e) => {
    console.log('KO:', e);
  });

module.exports = localizations;
