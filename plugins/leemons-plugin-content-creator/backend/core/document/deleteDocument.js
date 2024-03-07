/* eslint-disable no-param-reassign */
const _ = require('lodash');

async function deleteDocument({ id, ctx }) {
  const { versions } = await ctx.tx.call('assignables.assignables.removeAssignable', {
    assignable: id,
    removeAll: 1,
  });

  const documents = await ctx.tx.db.Documents.find({
    assignable: versions,
  })
    .select(['id'])
    .lean();
  const documentsIds = _.map(documents, 'id');

  await ctx.tx.db.Documents.deleteMany({ id: documentsIds });

  return true;
}

module.exports = deleteDocument;
