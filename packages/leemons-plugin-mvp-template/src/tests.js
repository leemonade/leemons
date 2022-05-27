/* eslint-disable no-unreachable */
/* eslint-disable no-await-in-loop */
const { keys, find, compact } = require('lodash');
const importQbanks = require('./bulk/tests/qbanks');
const importQuestions = require('./bulk/tests/questions');
const importTests = require('./bulk/tests/tests');

async function initTests({ users, programs }) {
  const { services } = leemons.getPlugin('tests');

  try {
    // ·····················································
    // QUESTIONS

    const { items: questionsItems, questions } = await importQuestions();

    // ·····················································
    // QBANKS

    const qbanks = await importQbanks(programs);
    const qbanksKeys = keys(qbanks);

    for (let i = 0, len = qbanksKeys.length; i < len; i++) {
      const key = qbanksKeys[i];
      const { creator, ...qbank } = qbanks[key];
      qbank.questions = questions
        .filter((question) => question.qbank === key)
        .map(({ qbank: qbankProp, ...question }) => question);

      const qbankData = await services.questionsBanks.save(
        { ...qbank, published: true },
        {
          userSession: users[creator],
        }
      );

      qbanks[key] = { ...qbankData };
    }

    // ·····················································
    // TESTS

    const tests = await importTests({ qbanks, programs, questionsItems });
    const testsKeys = keys(tests);

    console.log('--- TESTS ---');
    console.dir(tests, { depth: null });

    for (let i = 0, len = testsKeys.length; i < len; i++) {
      const key = testsKeys[i];
      const { creator, ...test } = tests[key];

      const testData = await services.tests.save(
        { ...test, published: true },
        {
          userSession: users[creator],
        }
      );

      tests[key] = { ...testData };
    }

    return tests;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initTests;
