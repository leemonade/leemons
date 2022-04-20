const _ = require('lodash');
const { table } = require('../tables');

async function listQuestionsBanks(page, size, { published, query = {}, transacting } = {}) {
  const versionControlService = leemons.getPlugin('common').services.versionControl;
  const versions = await versionControlService.listVersionOfType('question-bank', {
    published,
    transacting,
  });
  const paginate = await global.utils.paginate(
    table.questionsBanks,
    page,
    size,
    {
      ...query,
      id_$in: _.map(versions, 'fullId'),
    },
    {
      transacting,
    }
  );
  const questions = await table.questions.find(
    { questionBank_$in: _.map(paginate.items, 'id') },
    { columns: ['id', 'questionBank'], transacting }
  );
  const questionsByBank = _.groupBy(questions, 'questionBank');
  return {
    ...paginate,
    items: _.map(paginate.items, (item) => ({
      ...item,
      nQuestions: questionsByBank[item.id]?.length || 0,
    })),
  };
}

module.exports = { listQuestionsBanks };
