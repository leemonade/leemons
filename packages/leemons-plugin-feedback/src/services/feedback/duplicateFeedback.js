/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { deleteFeedbackQuestions } = require('../feedback-questions/deleteFeedbackQuestions');

async function duplicateFeedback(id, { published, userSession, transacting: _transacting } = {}) {
  const { assignables: assignableService } = leemons.getPlugin('assignables').services;
  return global.utils.withTransaction(
    async (transacting) => {
      const newAssignable = await assignableService.duplicateAssignable(id, {
        published,
        userSession,
        transacting,
      });
      console.log(newAssignable);
      throw new Error('miau');
    },
    table.feedbackQuestions,
    _transacting
  );
}

module.exports = duplicateFeedback;
