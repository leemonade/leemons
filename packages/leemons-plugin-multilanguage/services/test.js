/* eslint-disable global-require */

if (process.env.TEST === 'true') {
  const localization = require('../src/services/localization/test');
  const locales = require('../src/services/locale/test');

  locales().then(() => {
    localization();
  });
}
