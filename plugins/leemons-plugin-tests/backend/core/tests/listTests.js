const _ = require('lodash');
const { table } = require('../tables');

async function listTests(page, size, { published, transacting } = {}) {
  const versionControlService = leemons.getPlugin('common').services.versionControl;
  const versions = await versionControlService.listVersionsOfType('test', {
    published,
    transacting,
  });
  const paginate = await global.utils.paginate(
    table.tests,
    page,
    size,
    {
      id_$in: _.map(versions, 'fullId'),
    },
    {
      transacting,
    }
  );
  const questions = await table.questionsTests.find(
    { test_$in: _.map(paginate.items, 'id') },
    { columns: ['id', 'test'], transacting }
  );
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
