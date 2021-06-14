const localizations = require('../src/services/localization');

localizations
  .deleteKeyStartsWith('message')
  .then((r) => {
    console.log('OK:', JSON.stringify(r, '', 2));
  })
  .catch((e) => {
    console.log('KO:', e);
  });

module.exports = localizations;
