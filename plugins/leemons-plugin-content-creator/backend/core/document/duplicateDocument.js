/* eslint-disable no-param-reassign */
const getDocument = require('./getDocument');

async function duplicateDocument({ id, published, ctx }) {
  const newAssignable = await ctx.tx.call('assignables.assignables.duplicateAssignable', {
    assignableId: id,
    published,
  });

  const document = await getDocument({ id, ctx });

  const newDocument = { ...document };
  delete newDocument.id;
  newDocument.assignable = newAssignable.id;

  await ctx.tx.db.Documents.create(newDocument);

  if (newAssignable.metadata.featuredImage) {
    const newFeaturedImage = await ctx.tx.call('leebrary.assets.duplicate', {
      assetId: newAssignable.metadata.featuredImage,
      preserveName: true,
    });
    newAssignable.metadata.featuredImage = newFeaturedImage.id;
    await ctx.tx.call('assignables.assignables.updateAssignable', {
      assignable: newAssignable,
      published,
    });
  }

  return true;
}

module.exports = duplicateDocument;
