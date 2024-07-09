const { LeemonsError } = require('@leemons/error');
const { map } = require('lodash');
const { duplicateQuestionBank } = require('../questions-banks/duplicateQuestionBank');
const { getTestsDetails } = require('./getTestsDetails');
const { saveTest } = require('./saveTest');

/**
 * Duplicate a test
 *
 * @param {object} params - Duplicate test params
 * @param {string} params.taskId - Test id
 * @param {boolean} params.published - Test published
 * @param {boolean} params.keepQuestionBank - Keep question bank
 * @param {MoleculerContext} params.ctx - Moleculer context
 * @returns {Promise<object>} New test
 *
 * @description
 * The `duplicate` function is responsible for duplicating a test. It performs the following steps:
 * 1. Duplicates the assignable (test) using the `assignables.assignables.duplicateAssignable` action.
 * 2. Retrieves the details of the current test and the newly duplicated test.
 * 3. Updates the details of the new test, such as setting the `id`, `cover`, and `config` properties.
 * 4. If `keepQuestionBank` is set to `false`, duplicates the question bank and assigns it to the new test.
 * 5. Saves the updated details of the new test using the `saveTest` function.
 * 6. Returns the newly duplicated test.
 * If any error occurs during the duplication process, it throws an error with a message indicating the specific error.
 */
async function duplicate({ taskId, published, ignoreSubjects, keepQuestionBank, ctx }) {
  try {
    const newTest = await ctx.tx.call('assignables.assignables.duplicateAssignable', {
      assignableId: taskId,
      published: false,
      ignoreSubjects,
    });

    if (!newTest) {
      throw new LeemonsError(ctx, { message: 'Test / Assignable duplication failed' });
    }

    const [newTestDetails] = await getTestsDetails({
      id: newTest.id,
      withQuestionBank: true,
      ctx,
    });
    newTestDetails.id = newTest.id;
    newTestDetails.cover = newTestDetails.cover?.id ?? newTestDetails.cover;

    // Set default values
    const [currentTest] = await getTestsDetails({ id: taskId, withQuestionBank: true, ctx });
    const { questionBank } = currentTest;
    newTestDetails.questionBank = questionBank?.id ?? questionBank;
    newTestDetails.questions = map(currentTest.questions, 'id');
    // newTestDetails.subjects = currentTest.subjects;
    newTestDetails.published = published;

    // If keepQuestionBank is false, we duplicate the question bank
    if (!keepQuestionBank) {
      const newQuestionBank = await duplicateQuestionBank({
        id: questionBank.id,
        ignoreSubjects,
        ctx,
      });
      const {
        questionBank: { questions },
      } = await ctx.tx.call('tests.questionsBanks.getQuestionBankDetailRest', {
        id: newQuestionBank.id,
        getAssets: false,
      });
      newTestDetails.questionBank = newQuestionBank.id;
      newTestDetails.questions = [];
      currentTest.questions.forEach((oldQuestion) => {
        const comparisonStringA = `${oldQuestion.level}${oldQuestion.question}${oldQuestion.type}`;
        const newQuestion = questions.find(({ level, question, type }) => {
          const comparisonStringB = `${level}${question}${type}`;
          return comparisonStringA === comparisonStringB;
        });
        if (newQuestion) newTestDetails.questions.push(newQuestion.id);
      });
    }

    // If ignoreSubjects is true, we remove the subjects from the config
    if (ignoreSubjects) {
      newTestDetails.subjects = [];
      newTestDetails.config = { ...(newTestDetails.config ?? {}), hasObjectives: false };
    }

    await saveTest({ data: newTestDetails, ignoreAsset: true, ctx });

    return newTest;
  } catch (e) {
    throw new Error(`Error duplicating test: ${e.message}`);
  }
}

module.exports = { duplicate };
