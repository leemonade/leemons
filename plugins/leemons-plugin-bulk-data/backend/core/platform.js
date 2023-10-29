/* eslint-disable no-await-in-loop */
const { keys } = require('lodash');
const importPlatform = require('./bulk/platform');

async function initPlatform({ file, ctx }) {
  try {
    const platform = await importPlatform(file);
    const itemKeys = keys(platform);

    const itemKey = itemKeys[0]; // Just one platform
    const { email, locale, hostname } = platform[itemKey];

    await Promise.all([
      ctx.tx.call('users.platform.setDefaultLocale', { value: locale }),
      ctx.tx.call('users.platform.setEmail', { value: email }),
      ctx.tx.call('users.platform.setHostname', { value: hostname }),
      ctx.tx.call('users.platform.setAppearanceDarkMode', { value: true }),
    ]);

    return platform;
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

module.exports = initPlatform;
