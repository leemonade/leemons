const _ = require('lodash');
const { table } = require('../tables');

async function listQuestionsBanks(
  page,
  size,
  { subjects, published, query = {}, transacting } = {}
) {
  const versionControlService = leemons.getPlugin('common').services.versionControl;
  const versions = await versionControlService.listVersionsOfType('question-bank', {
    published,
    transacting,
  });
  let ids = _.map(versions, 'fullId');
  if (subjects && subjects.length) {
    const questionBankSubjects = await table.questionBankSubjects.find(
      {
        subject_$in: subjects,
        questionBank_$in: ids,
      },
      {
        transacting,
      }
    );
    ids = _.uniq(_.map(questionBankSubjects, 'questionBank'));
  }
  const paginate = await global.utils.paginate(
    table.questionsBanks,
    page,
    size,
    {
      ...query,
      id_$in: ids,
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
