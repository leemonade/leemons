/* eslint-disable no-unreachable */
/* eslint-disable no-await-in-loop */
const { keys, find, compact } = require('lodash');
const importQbanks = require('./bulk/tests/qbanks');
const importQuestions = require('./bulk/tests/questions');

async function initTests({ users, programs }) {
  const { services } = leemons.getPlugin('tests');

  try {
    // ·····················································
    // QUESTIONS

    const questions = await importQuestions();

    // console.log('--- QUESTIONS ---');
    // console.dir(questions, { depth: null });

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

    const tests = {
      test01: {
        qbanks,
      },
    };

    return tests;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initTests;
