const locales = require('../src/services/locale');

console.log();
locales
  .addMany([
    ['es-ES', 'Español de España'],
    ['en-EN', 'Español de España'],
  ])
  .then((r) => {
    console.log('OK:', r);
  })
  .catch((e) => {
    console.error('KO:', e);
  })
  .finally(() => {
    console.log();
  });

module.exports = locales;
