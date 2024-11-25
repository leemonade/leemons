/* eslint-disable no-unreachable */
/* eslint-disable no-await-in-loop */
const chalk = require('chalk');
const { keys, isEmpty, uniqBy, isNil } = require('lodash');

const _delay = require('./bulk/helpers/delay');
const importQbanks = require('./bulk/tests/qbanks');
const importQuestions = require('./bulk/tests/questions');
const importTests = require('./bulk/tests/tests');
const { makeAssetNotIndexable } = require('./helpers/makeAssetNotIndexable');
const { LOAD_PHASES } = require('./importHandlers/getLoadStatus');

async function initTests({ file, config: { users, programs }, ctx, useCache, phaseKey }) {
  try {
    // ·····················································
    // QUESTIONS

    const { items: questionItems, questions } = await importQuestions(file);

    const categories = uniqBy(
      questions
        .filter((question) => question.category)
        .map((question) => ({ value: question.category })),
      'value'
    ).map((category, index) => ({ ...category, order: index }));

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
          category: categories.find((c) => c.value === category)?.order,
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
        keys(questionItems).forEach((qKey) => {
          const question = questionItems[qKey];
          if (question.qbank === key) {
            const questionFromDataBase = qbanksDetail.questions.find(
              (q) => q.stem.text === question.stem.text
            );
            question.id = questionFromDataBase.id;
          }
        });
      }

      qbanks[key] = !isNil(qbankData) ? { ...qbankData, questions: qbanksDetail?.questions } : null;
    }

    // ·····················································
    // TESTS

    const tests = await importTests(file, { qbanks, programs, questions: questionItems });
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
