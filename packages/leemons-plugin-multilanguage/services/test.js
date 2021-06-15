const locales = require('../src/services/locale/test');

if (process.env.TEST === 'true') {
  locales();
}
