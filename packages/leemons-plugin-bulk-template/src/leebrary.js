/* eslint-disable no-await-in-loop */
const { keys, isEmpty, isNil } = require('lodash');
const importLibrary = require('./bulk/library');
const _delay = require('./bulk/helpers/delay');

async function initLibrary(file, { users }) {
  const { services } = leemons.getPlugin('leebrary');

  try {
    const assets = await importLibrary(file, { users });
    const assetsKeys = keys(assets);

    for (let i = 0, len = assetsKeys.length; i < len; i++) {
      const key = assetsKeys[i];
      const { creator, enabled, program, subject, ...asset } = assets[key];

      if (enabled !== false && enabled !== 'No') {
        try {
          leemons.log.debug(`Adding asset: ${asset.name}`);
          const assetData = await services.assets.add(asset, { userSession: creator });
          assets[key] = { ...assetData };

          leemons.log.info(`Asset ADDED: ${asset.name}`);
        } catch (e) {
          console.log('-- ASSET CREATION ERROR --');
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

async function updateLibrary(file, { assets, programs, users }) {
  const { services } = leemons.getPlugin('leebrary');

  try {
    const assetsRaw = await importLibrary(file, { users });
    const updatePromises = keys(assets)
      .map((key) => {
        const { creator, enabled, program: programKey, subject: subjectKey } = assetsRaw[key];
        if (enabled !== false && enabled !== 'No') {
          // eslint-disable-next-line camelcase
          const { created_at, deleted_at, updated_at, deleted, cover, ...asset } = assets[key];

          asset.cover = cover?.id ?? cover;
          asset.file = asset.file?.id ?? asset.file;

          const subjectId = programs[programKey]?.subjects[subjectKey]?.id;

          if (subjectId) {
            asset.subjects = [{ subject: subjectId, level: 'beginner' }];
            asset.program = programs[programKey]?.id;

            return services.assets.update(asset, { userSession: creator });
          }

          return null;
        }

        return null;
      })
      .filter((val) => !isEmpty(val));

    await Promise.all(updatePromises);
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = { initLibrary, updateLibrary };
