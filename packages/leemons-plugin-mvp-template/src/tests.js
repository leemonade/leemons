/* eslint-disable no-unreachable */
/* eslint-disable no-await-in-loop */
const { keys, find, isEmpty, findIndex, uniq, compact } = require('lodash');
const importQbanks = require('./bulk/tests/qbanks');
const importQuestions = require('./bulk/tests/questions');
const importTests = require('./bulk/tests/tests');

async function initTests({ users, programs }) {
  const { services } = leemons.getPlugin('tests');

  try {
    // ·····················································
    // QUESTIONS

    const { items: questionsItems, questions } = await importQuestions();

    // console.log('-- QUESTIONS --');
    // console.dir(questions, { depth: null });

    const categories = compact(uniq(questions.map((question) => ({ value: question.category }))));

    // ·····················································
    // QBANKS

    const qbanks = await importQbanks(programs);
    const qbanksKeys = keys(qbanks);

    for (let i = 0, len = qbanksKeys.length; i < len; i++) {
      const key = qbanksKeys[i];
      const { creator, ...qbank } = qbanks[key];
      qbank.questions = questions
        .filter((question) => question.qbank === key)
        .map(({ qbank: qbankProp, category, ...question }) => ({
          ...question,
          category: findIndex(categories, { value: category }),
        }));

      // console.log('-- QBANK --');
      // console.dir(qbank, { depth: null });

      const qbankData = await services.questionsBanks.save(
        { ...qbank, categories },
        {
          userSession: users[creator],
        }
      );

      // ·····················································
      // POST-PROCESSING QUESTIONS

      // console.log('qbank.name:', qbank.name);
      // console.log('qbankData.asset:', qbankData.asset);

      const qbanksDetail = (
        await services.questionsBanks.findByAssetIds([qbankData.asset], {
          userSession: users[creator],
        })
      )[0];

      if (qbanksDetail && !isEmpty(qbanksDetail.questions)) {
        keys(questionsItems).forEach((qKey) => {
          const question = questionsItems[qKey];
          if (question.qbank === key) {
            const qbankQuestion = qbanksDetail.questions.find(
              (q) => q.question === question.question
            );
            question.id = qbankQuestion.id;
            questionsItems[qKey] = question;
          }
        });
      } else {
        // console.log('No tenemos questions para el Qbank');
      }

      qbanks[key] = { ...qbankData, questions: qbanksDetail.questions };
    }

    // ·····················································
    // TESTS

    const tests = await importTests({ qbanks, programs, questions: questionsItems });
    const testsKeys = keys(tests);

    // console.log('--- TESTS ---');
    // console.dir(tests, { depth: null });

    for (let i = 0, len = testsKeys.length; i < len; i++) {
      const key = testsKeys[i];
      const { creator, ...test } = tests[key];

      const testData = await services.tests.save(
        { ...test },
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
