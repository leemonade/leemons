const _ = require('lodash');
const { table } = require('../tables');

async function listQuestionsBanks(page, size, { transacting } = {}) {
  const paginate = await global.utils.paginate(
    table.questionsBanks,
    page,
    size,
    {},
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
