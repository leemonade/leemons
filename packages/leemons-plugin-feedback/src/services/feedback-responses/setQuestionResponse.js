const { table } = require('../tables');

async function setQuestionResponse(data, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const { questionId, instanceId, value } = data;

      const response = await table.feedbackResponse.set(
        { question: questionId, instance: instanceId, userAgent: userSession.userAgents[0].id },
        {
          response: JSON.stringify(value),
          question: questionId,
          instance: instanceId,
          userAgent: userSession.userAgents[0].id,
        },
        { transacting }
      );

      return response;
    },
    table.feedbackResponse,
    _transacting
  );
}

module.exports = setQuestionResponse;
