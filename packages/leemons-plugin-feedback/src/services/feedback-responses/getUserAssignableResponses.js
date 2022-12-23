const { table } = require('../tables');

async function getUserAssignableResponses(
  instanceId,
  { userSession, transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const results = await table.feedbackResponse.find(
        {
          instance: instanceId,
          userAgent: userSession.userAgents[0].id,
        },
        { transacting }
      );

      const responses = {};
      results.forEach((result) => {
        responses[result.question] = JSON.parse(result.response);
      });

      return responses;
    },
    table.feedbackResponse,
    _transacting
  );
}

module.exports = getUserAssignableResponses;
