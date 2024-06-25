/* eslint-disable no-await-in-loop */
const { keys } = require('lodash');
const chalk = require('chalk');
const importContentCreatorDocuments = require('./bulk/contentCreator');
const { makeAssetNotIndexable } = require('./helpers/makeAssetNotIndexable');

async function initContentCreator({ file, config, ctx }) {
  try {
    const documents = await importContentCreatorDocuments({ file, config, ctx });
    const documentKeys = keys(documents);

    for (let i = 0, len = documentKeys.length; i < len; i++) {
      const key = documentKeys[i];
      const { creator, hideInLibrary, ...document } = documents[key];

      try {
        ctx.logger.debug(`Adding Content Creator document: ${document.name}`);
        const { document: documentData } = await ctx.call(
          'content-creator.document.saveDocumentRest',
          {
            data: JSON.stringify(document),
          },
          {
            meta: { userSession: { ...creator } },
          }
        );

        const { document: documentDetail } = await ctx.call(
          'content-creator.document.getDocumentRest',
          {
            id: documentData.assignable,
          }
        );

        if (hideInLibrary) {
          await makeAssetNotIndexable({
            creator: { ...creator },
            assetId: documentDetail.asset.id,
            assetName: documentDetail.name,
            ctx,
          });
        }

        documents[key] = { ...documentDetail };
        ctx.logger.info(`Document ADDED: ${document.name}`);
      } catch (e) {
        ctx.logger.info(chalk`{red.bold WARN} -- DOCUMENT CREATION ERROR --`);
        ctx.logger.error(e);
      }
    }

    return documents;
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

module.exports = { initContentCreator };
