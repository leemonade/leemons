/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { deleteFeedbackQuestions } = require('../feedback-questions/deleteFeedbackQuestions');

async function deleteFeedback(id, { userSession, transacting: _transacting } = {}) {
  const { assignables } = leemons.getPlugin('assignables').services;
  return global.utils.withTransaction(
    async (transacting) => {
      const { versions } = await assignables.removeAssignable(id, {
        userSession,
        transacting,
        removeAll: 1,
      });

      const questions = await table.feedbackQuestions.find(
        {
          assignable_$in: versions,
        },
        { transacting, columns: ['id'] }
      );

      await deleteFeedbackQuestions(_.map(questions, 'id'), { userSession, transacting });

      return true;
    },
    table.feedbackQuestions,
    _transacting
  );
}

module.exports = deleteFeedback;
