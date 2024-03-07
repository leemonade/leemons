const _ = require('lodash');
const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

async function listTests({ page, size, published, ctx }) {
  const versions = await ctx.tx.call('common.versionControl.listVersionsOfType', {
    type: 'test',
    published,
  });
  const paginate = await mongoDBPaginate({
    model: ctx.tx.db.Tests,
    page,
    size,
    query: { id: _.map(versions, 'fullId') },
  });
  const questions = await ctx.tx.db.QuestionsTests.find({ test: _.map(paginate.items, 'id') })
    .select(['id', 'test'])
    .lean();
  const questionsByTest = _.groupBy(questions, 'test');
  return {
    ...paginate,
    items: _.map(paginate.items, (item) => ({
      ...item,
      nQuestions: questionsByTest[item.id]?.length || 0,
    })),
  };
}

module.exports = { listTests };
