/* eslint-disable no-await-in-loop */
const { keys } = require('lodash');
const importPlatform = require('./bulk/platform');

async function initPlatform(file) {
  const { services } = leemons.getPlugin('users');

  try {
    const platform = await importPlatform(file);
    const itemKeys = keys(platform);

    const itemKey = itemKeys[0]; // Just one platform
    const { email, locale, hostname } = platform[itemKey];

    await Promise.all([
      services.platform.setDefaultLocale(locale),
      services.platform.setEmail(email),
      services.platform.setHostname(hostname),
      services.platform.setAppearanceDarkMode(true),
    ]);

    return platform;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initPlatform;
