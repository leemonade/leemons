/* eslint-disable no-param-reassign */
const { table } = require('../tables');
const getDocument = require('./getDocument');

async function duplicateDocument(id, { published, userSession, transacting: _transacting } = {}) {
  const { assignables: assignableService } = leemons.getPlugin('assignables').services;
  const { assets: assetsService } = leemons.getPlugin('leebrary').services;
  return global.utils.withTransaction(
    async (transacting) => {
      const newAssignable = await assignableService.duplicateAssignable(id, {
        published,
        userSession,
        transacting,
      });

      const document = await getDocument(id, { userSession, transacting });

      const newDocument = { ...document };
      delete newDocument.id;
      newDocument.assignable = newAssignable.id;

      await table.documents.create(newDocument, { transacting });

      if (newAssignable.metadata.featuredImage) {
        const newFeaturedImage = await assetsService.duplicate(
          newAssignable.metadata.featuredImage,
          {
            preserveName: true,
            userSession,
            transacting,
          }
        );
        newAssignable.metadata.featuredImage = newFeaturedImage.id;
        await assignableService.updateAssignable(newAssignable, {
          userSession,
          transacting,
          published,
        });
      }

      return true;
    },
    table.documents,
    _transacting
  );
}

module.exports = duplicateDocument;
