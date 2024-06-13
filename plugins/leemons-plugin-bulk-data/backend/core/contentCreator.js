/* eslint-disable no-await-in-loop */
const { keys } = require('lodash');
const _delay = require('./bulk/helpers/delay');
const importContentCreatorDocuments = require('./bulk/contentCreator');

async function initContentCreator({ file, config: { users, programs, assets }, ctx }) {
  try {
    const documents = await importContentCreatorDocuments({ file, users, programs, assets, ctx });
    const assetsKeys = keys(documents);

    for (let i = 0, len = assetsKeys.length; i < len; i++) {
      const key = assetsKeys[i];
      const { creator, ...asset } = documents[key];

      try {
        // ctx.logger.debug(`Adding asset: ${asset.name}`);
        // const assetData = await ctx.call(
        //   'leebrary.assets.add',
        //   {
        //     asset,
        //   },
        //   {
        //     meta: { userSession: { ...creator } },
        //   }
        // );
        // documents[key] = { ...assetData };
        console.log('PAYLOAD for ', asset.name, '------------------------------------');
        console.log(asset);

        ctx.logger.info(`Asset ADDED: ${asset.name}`);
      } catch (e) {
        ctx.logger.log('-- ASSET CREATION ERROR --');
        ctx.logger.error(e);
      }

      await _delay(1000);
    }

    return documents;
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

module.exports = { initContentCreator };
