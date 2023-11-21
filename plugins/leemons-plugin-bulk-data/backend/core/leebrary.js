/* eslint-disable no-await-in-loop */
const { keys, isEmpty } = require('lodash');
const importLibrary = require('./bulk/library');
const _delay = require('./bulk/helpers/delay');

async function initLibrary({ file, config: { users }, ctx }) {
  try {
    const assets = await importLibrary(file, { users });
    const assetsKeys = keys(assets);

    for (let i = 0, len = assetsKeys.length; i < len; i++) {
      const key = assetsKeys[i];
      const { creator, enabled, program, subject, ...asset } = assets[key];

      if (enabled !== false && enabled !== 'No') {
        try {
          ctx.logger.debug(`Adding asset: ${asset.name}`);
          const assetData = await ctx.call(
            'leebrary.assets.add',
            {
              asset,
            },
            {
              meta: { userSession: { ...creator } },
            }
          );
          assets[key] = { ...assetData };

          ctx.logger.info(`Asset ADDED: ${asset.name}`);
        } catch (e) {
          ctx.logger.log('-- ASSET CREATION ERROR --');
          ctx.logger.error(e);
        }

        await _delay(1000);
      }
    }

    return assets;
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

async function updateLibrary({ file, config: { assets, programs, users }, ctx }) {
  try {
    const assetsRaw = await importLibrary(file, { users });
    const updatePromises = keys(assets)
      .map((key) => {
        const { creator, enabled, program: programKey, subject: subjectKey } = assetsRaw[key];
        if (enabled !== false && enabled !== 'No') {
          const {
            // eslint-disable-next-line camelcase
            created_at,
            // eslint-disable-next-line camelcase
            deleted_at,
            // eslint-disable-next-line camelcase
            updated_at,
            createdAt,
            deletedAt,
            updatedAt,
            deleted,
            cover,
            ...asset
          } = assets[key];

          asset.cover = cover?.id ?? cover;
          asset.file = asset.file?.id ?? asset.file;

          const subjectId = programs[programKey]?.subjects[subjectKey]?.id;

          if (subjectId) {
            asset.subjects = [{ subject: subjectId, level: 'beginner' }];
            asset.program = programs[programKey]?.id;
            console.log(
              '🛑 en core/leebrary updateLibrary: asset.public etc. Debería ser undefined => ',
              asset.public
            );

            return ctx.call(
              'leebrary.assets.update',
              {
                data: asset,
              },
              { meta: { userSession: { ...creator } } }
            );
          }

          return null;
        }

        return null;
      })
      .filter((val) => !isEmpty(val));

    await Promise.all(updatePromises);
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

module.exports = { initLibrary, updateLibrary };
