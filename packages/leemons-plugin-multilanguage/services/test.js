const locales = require('../src/services/locale/test');
const localization = require('../src/services/localization/test');

if (process.env.TEST === 'true') {
  locales().then(() => {
    localization();
  });
}
