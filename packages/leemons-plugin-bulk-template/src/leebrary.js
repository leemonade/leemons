/* eslint-disable no-await-in-loop */
const { keys } = require('lodash');
const importLibrary = require('./bulk/library');

function _delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function initLibrary({ users }) {
  const { services } = leemons.getPlugin('leebrary');

  try {
    const assets = await importLibrary({ users });
    const assetsKeys = keys(assets);

    for (let i = 0, len = assetsKeys.length; i < len; i++) {
      const key = assetsKeys[i];
      const { creator, enabled, ...asset } = assets[key];

      if (enabled !== false && enabled !== 'No') {
        try {
          leemons.log.debug(`Adding asset: ${asset.name}`);
          const assetData = await services.assets.add(asset, { userSession: creator });
          assets[key] = { ...assetData };

          leemons.log.info(`Asset ADDED: ${asset.name}`);
        } catch (e) {
          console.log('-- CREATOR ERROR --');
          console.dir(asset, { depth: null });
          console.dir(creator, { depth: null });
          console.error(e);
        }

        await _delay(1000);
      }
    }

    return assets;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = { initLibrary };
