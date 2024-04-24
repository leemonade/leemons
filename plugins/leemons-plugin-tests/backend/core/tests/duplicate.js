const { LeemonsError } = require('@leemons/error');
const { duplicateQuestionBank } = require('../questions-banks/duplicateQuestionBank');
const { getTestsDetails } = require('./getTestsDetails');
const { saveTest } = require('./saveTest');

async function duplicate({ taskId, published, ignoreSubjects, ctx }) {
  try {
    const newTest = await ctx.tx.call('assignables.assignables.duplicateAssignable', {
      assignableId: taskId,
      published,
      ignoreSubjects,
    });

    if (!newTest) {
      throw new LeemonsError(ctx, { message: 'Test / Assignable duplication failed' });
    }

    const [currentTest] = await getTestsDetails({ id: taskId, withQuestionBank: true, ctx });
    const [newTestDetails] = await getTestsDetails({
      id: newTest.id,
      withQuestionBank: true,
      ctx,
    });
    const { questionBank } = currentTest;

    const newQuestionBank = await duplicateQuestionBank({
      id: questionBank.id,
      ignoreSubjects,
      ctx,
    });

    newTestDetails.id = newTest.id;
    newTestDetails.questionBank = newQuestionBank.id;
    newTestDetails.questions = [];
    newTestDetails.cover = newTestDetails.cover?.id ?? newTestDetails.cover;
    newTestDetails.config = { ...(newTestDetails.config ?? {}), hasObjectives: false };
    await saveTest({ data: newTestDetails, ctx });

    return newTest;
  } catch (e) {
    throw new Error(`Error duplicating test: ${e.message}`);
  }
}

module.exports = { duplicate };
