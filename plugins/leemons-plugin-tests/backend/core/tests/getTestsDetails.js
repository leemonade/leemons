/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { getQuestionsBanksDetails } = require('../questions-banks/getQuestionsBanksDetails');

async function getTestsDetails(id, { userSession, withQuestionBank, transacting } = {}) {
  const { assignables: assignableService } = leemons.getPlugin('assignables').services;
  const ids = _.isArray(id) ? id : [id];

  const assignables = await assignableService.getAssignables(ids, {
    withFiles: true,
    userSession,
    transacting,
  });

  const questionBankIds = [];
  let questionIds = [];
  _.forEach(assignables, (assignable) => {
    if (withQuestionBank) {
      if (assignable?.metadata?.questionBank) {
        questionBankIds.push(assignable.metadata.questionBank);
      }
    }
    if (assignable?.metadata?.questions) {
      questionIds = questionIds.concat(assignable.metadata.questions);
    }
  });

  const [questions, questionBanks] = await Promise.all([
    table.questions.find({ id_$in: _.uniq(questionIds) }, { transacting }),
    getQuestionsBanksDetails(questionBankIds, { userSession, transacting }),
  ]);

  const questionBankById = _.keyBy(questionBanks, 'id');
  const questionsById = _.keyBy(questions, 'id');

  return _.map(assignables, (assignable) => ({
    id: assignable.id,
    name: assignable.asset.name,
    description: assignable.asset.description,
    tagline: assignable.asset.tagline,
    color: assignable.asset.color,
    cover: assignable.asset.cover,
    tags: assignable.asset.tags,
    program: assignable.subjects[0]?.program,
    subjects: _.map(assignable.subjects, ({ subject }) => subject),
    statement: assignable.statement,
    instructionsForTeachers: assignable.instructionsForTeachers,
    instructionsForStudents: assignable.instructionsForStudents,
    gradable: assignable.gradable,
    questionBank: questionBankById[assignable.metadata.questionBank]
      ? questionBankById[assignable.metadata.questionBank]
      : assignable.metadata.questionBank,
    filters: assignable.metadata.filters,
    questions: _.map(assignable?.metadata?.questions, (questionId) => ({
      ...questionsById[questionId],
      properties: JSON.parse(questionsById[questionId].properties),
    })),
    type: assignable.metadata.type,
    levels: assignable.metadata.level,
    curriculum: assignable.subjects?.[0]?.curriculum,
  }));

  /*
  const tagsService = leemons.getPlugin('common').services.tags;
  const ids = _.isArray(id) ? id : [id];
  const [tests, questionsTests] = await Promise.all([
    table.tests.find({ id_$in: ids }, { transacting }),
    table.questionsTests.find({ test_$in: ids }, { transacting }),
  ]);

  const questions = await table.questions.find(
    { id_$in: _.map(questionsTests, 'question') },
    { transacting }
  );

  const promises = [];
  if (tests.length) {
    promises.push(
      tagsService.getValuesTags(_.map(tests, 'id'), {
        type: 'plugins.tests.tests',
        transacting,
      })
    );
  } else {
    promises.push(Promise.resolve([]));
  }

  if (questions.length) {
    promises.push(
      tagsService.getValuesTags(_.map(questions, 'id'), {
        type: 'plugins.tests.questions',
        transacting,
      })
    );
  } else {
    promises.push(Promise.resolve([]));
  }

  const [questionBanksTags, questionsTags] = await Promise.all(promises);

  _.forEach(tests, (questionBank, i) => {
    questionBank.tags = questionBanksTags[i];
  });
  _.forEach(questions, (question, i) => {
    question.tags = questionsTags[i];
  });

  const questionsById = _.keyBy(questions, 'id');
  const questionsTestsByTest = _.groupBy(questionsTests, 'test');

  return _.map(tests, (test) => ({
    ...test,
    filters: JSON.parse(test.filters),
    questions: _.map(questionsTestsByTest[test.id] || [], (quest) => ({
      ...questionsById[quest.question],
      properties: JSON.parse(questionsById[quest.question].properties),
    })),
  }));

   */
}

module.exports = { getTestsDetails };
