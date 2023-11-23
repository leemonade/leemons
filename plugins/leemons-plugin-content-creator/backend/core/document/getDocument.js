/* eslint-disable no-param-reassign */
const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');

async function getDocument({ id, ctx }) {
  // Check is userSession is provided
  if (!ctx.meta.userSession)
    throw new LeemonsError(ctx, { message: 'User session is required (getDocument)' });

  const ids = _.isArray(id) ? id : [id];

  const assignables = await Promise.all(
    _.map(ids, (_id) =>
      ctx.tx.call('assignables.assignables.getAssignable', { id: _id, withFiles: true })
    )
  );

  const imagesIds = [];
  _.forEach(assignables, (assignable) => {
    if (assignable.metadata.featuredImage) imagesIds.push(assignable.metadata.featuredImage);
  });

  const documentAssets = await ctx.tx.call('leebrary.assets.getByIds', {
    ids: imagesIds,
    withFiles: true,
  });

  const documentAssetsById = _.keyBy(documentAssets, 'id');

  const assignableIds = _.map(assignables, 'id');
  const documents = await ctx.tx.db.Documents.find({ assignable: assignableIds }).lean();

  const documentsById = _.keyBy(documents, 'assignable');

  const result = _.map(assignables, (assignable) => ({
    id: assignable.id,
    asset: assignable.asset,
    name: assignable.asset.name,
    file: assignable.asset.file,
    tags: assignable.asset.tags,
    color: assignable.asset.color,
    cover: assignable.asset.cover,
    tagline: assignable.asset.tagline,
    featuredImage: documentAssetsById[assignable.metadata.featuredImage],
    description: assignable.asset.description,
    introductoryText: assignable.statement,
    content: documentsById[assignable.id]?.content,
    subjects: assignable.subjects,
    published: assignable.published,
  }));
  return _.isArray(id) ? result : result[0];
}

module.exports = getDocument;
