const { table } = require('../tables');

async function getUserAssignableResponses(data, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const { assignableId } = data;

      // const response = await table.feedbackResponse.set(
      //   { question: questionId, assignable: assignableId, userAgent: userSession.userAgents[0].id },
      //   {
      //     response: JSON.stringify(value),
      //     question: questionId,
      //     assignable: assignableId,
      //     userAgent: userSession.userAgents[0].id,
      //   },
      //   { transacting }
      // );

      return 'nose';
    },
    table.feedbackResponse,
    _transacting
  );
}

module.exports = getUserAssignableResponses;
