const { table } = require('../tables');

async function setQuestionResponse(data, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      console.log('setQuestionResponse');
      return 'nose';
    },
    table.feedbackResponse,
    _transacting
  );
}

module.exports = setQuestionResponse;
