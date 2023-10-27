/* eslint-disable no-unreachable */
/* eslint-disable no-await-in-loop */
const { keys, isEmpty, findIndex, uniqBy, isNil } = require('lodash');
const importQbanks = require('./bulk/tests/qbanks');
const importQuestions = require('./bulk/tests/questions');
const importTests = require('./bulk/tests/tests');
const _delay = require('./bulk/helpers/delay');

async function initTests(file, { users, programs }) {
  const { services } = leemons.getPlugin('tests');
  const { chalk } = global.utils;

  try {
    // ·····················································
    // QUESTIONS

    const { items: questionsItems, questions } = await importQuestions(file);

    const categories = uniqBy(
      questions.map((question) => ({ value: question.category })),
      'value'
    );

    // ·····················································
    // QBANKS

    const qbanks = await importQbanks(file, programs);
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

      let qbankData = null;

      try {
        leemons.log.debug(chalk`{cyan.bold BULK} {gray Adding QBank: ${qbank.name}}`);
        qbankData = await services.questionsBanks.save(
          { ...qbank, categories },
          {
            userSession: users[creator],
          }
        );
        leemons.log.info(chalk`{cyan.bold BULK} QBank ADDED: ${qbank.name}`);
      } catch (e) {
        console.log('-- QBANK CREATION ERROR --');
        console.log(`qbank: ${qbank.name}`);
        // console.dir(qbank, { depth: null });
        console.log(`creator: ${creator}`);
        console.error(e);
      }

      await _delay(10000);

      // ·····················································
      // POST-PROCESSING QUESTIONS

      const qbanksDetail = (
        await services.questionsBanks.findByAssetIds([qbankData?.asset], {
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
      }

      qbanks[key] = !isNil(qbankData) ? { ...qbankData, questions: qbanksDetail?.questions } : null;
    }

    // ·····················································
    // TESTS

    const tests = await importTests(file, { qbanks, programs, questions: questionsItems });
    const testsKeys = keys(tests);

    for (let i = 0, len = testsKeys.length; i < len; i++) {
      const key = testsKeys[i];
      const { creator, ...test } = tests[key];

      try {
        leemons.log.debug(chalk`{cyan.bold BULK} {gray Adding Test: ${test.name}}`);
        const testData = await services.tests.save(
          { ...test },
          {
            userSession: users[creator],
          }
        );

        tests[key] = { ...testData };
        leemons.log.info(chalk`{cyan.bold BULK} Test ADDED: ${test.name}`);
      } catch (e) {
        console.log('-- TEST CREATION ERROR --');
        console.log(`test: ${test.name}`);
        console.log(`creator: ${creator}`);
        console.error(e);
      }
    }

    return tests;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initTests;
