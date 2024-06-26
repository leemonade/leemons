/* eslint-disable no-unreachable */
/* eslint-disable no-await-in-loop */
const chalk = require('chalk');
const { keys, isEmpty, findIndex, uniqBy, isNil } = require('lodash');
const importQbanks = require('./bulk/tests/qbanks');
const importQuestions = require('./bulk/tests/questions');
const importTests = require('./bulk/tests/tests');
const _delay = require('./bulk/helpers/delay');
const { LOAD_PHASES } = require('./importHandlers/getLoadStatus');
const { makeAssetNotIndexable } = require('./helpers/makeAssetNotIndexable');

async function initTests({ file, config: { users, programs }, ctx, useCache, phaseKey }) {
  try {
    // ·····················································
    // QUESTIONS

    const { items: questionsItems, questions } = await importQuestions(file);

    const categories = uniqBy(
      questions
        .filter((question) => question.category)
        .map((question) => ({ value: question.category })),
      'value'
    );

    // ·····················································
    // QBANKS

    const qbanks = await importQbanks(file, programs);
    const qbanksKeys = keys(qbanks);

    for (let i = 0, len = qbanksKeys.length; i < len; i++) {
      const key = qbanksKeys[i];
      const { creator, hideInLibrary, ...qbank } = qbanks[key];
      qbank.questions = questions
        .filter((question) => question.qbank === key)
        .map(({ qbank: qbankProp, category, ...question }) => ({
          ...question,
          category: findIndex(categories, { value: category }),
        }));

      let qbankData = null;

      try {
        ctx.logger.debug(chalk`{cyan.bold BULK} {gray Adding QBank: ${qbank.name}}`);
        const payload = { ...qbank };
        if (categories.length) {
          payload.categories = categories;
        }

        qbankData = await ctx.call(
          'tests.questionsBanks.save',
          {
            data: payload,
          },
          { meta: { userSession: { ...users[creator] } } }
        );

        if (hideInLibrary) {
          await makeAssetNotIndexable({
            creator: { ...users[creator] },
            assetId: qbankData.asset,
            assetName: qbankData.name,
            ctx,
          });
        }

        ctx.logger.info(chalk`{cyan.bold BULK} QBank ADDED: ${qbank.name}`);
      } catch (e) {
        ctx.logger.log('-- QBANK CREATION ERROR --');
        ctx.logger.log(`qbank: ${qbank.name}`);
        ctx.logger.log(`creator: ${creator}`);
        ctx.logger.error(e);
      }

      await _delay(10000);

      // ·····················································
      // POST-PROCESSING QUESTIONS

      const qbanksDetail = (
        await ctx.call(
          'tests.questionsBanks.findByAssetIds',
          {
            ids: [qbankData?.asset],
          },
          { meta: { userSession: { ...users[creator] } } }
        )
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
      const { creator, hideInLibrary, ...test } = tests[key];

      try {
        ctx.logger.debug(chalk`{cyan.bold BULK} {gray Adding Test: ${test.name}}`);
        const testData = await ctx.call(
          'tests.tests.save',
          {
            ...test,
          },
          { meta: { userSession: { ...users[creator] } } }
        );

        if (hideInLibrary) {
          await makeAssetNotIndexable({
            creator: { ...users[creator] },
            assetId: testData.asset,
            assetName: tests[key].name,
            ctx,
          });
        }

        tests[key] = { ...testData };
        ctx.logger.info(chalk`{cyan.bold BULK} Test ADDED: ${test.name}`);

        if (useCache) {
          await ctx.cache.set(
            phaseKey,
            `${LOAD_PHASES.TESTS}[${i + 1}/${testsKeys.length}]`,
            60 * 60
          );
        }
      } catch (e) {
        ctx.logger.log('-- TEST CREATION ERROR --');
        ctx.logger.log(`test: ${test.name}`);
        ctx.logger.log(`creator: ${creator}`);
        ctx.logger.error(e);
      }
    }

    return { tests, qbanks };
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

module.exports = initTests;
