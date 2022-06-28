/* eslint-disable no-await-in-loop */
const { keys } = require('lodash');
const importPlatform = require('./bulk/platform');

async function initPlatform() {
  const { services } = leemons.getPlugin('users');

  try {
    const platform = await importPlatform();
    const itemKeys = keys(platform);

    const itemKey = itemKeys[0]; // Just one platform
    const { email, locale } = platform[itemKey];

    await services.platform.setDefaultLocale(locale);
    await services.platform.setEmail(email);

    return platform;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initPlatform;
