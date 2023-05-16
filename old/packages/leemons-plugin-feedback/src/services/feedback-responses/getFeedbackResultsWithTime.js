const { forEach, groupBy, map } = require('lodash');
const { table } = require('../tables');

async function getFeedbackResultsWithTime(instanceId, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const feedbackDates = await table.feedbackDates.find(
        { instance: instanceId },
        { transacting }
      );

      const datesObject = {};
      forEach(feedbackDates, (feedbackDate) => {
        datesObject[feedbackDate.endDate || feedbackDate.startDate] = {
          userAgent: feedbackDate.userAgent,
        };
      });
      const userAgents = Object.values(datesObject).map((value) => value.userAgent);
      const userResponses = await table.feedbackResponse.find({
        instance: instanceId,
        userAgent_$in: userAgents,
      });
      const responsesByUser = groupBy(
        map(userResponses, (value) => ({
          ...value,
          response: JSON.parse(value.response),
        })),
        'userAgent'
      );

      forEach(Object.entries(datesObject), ([key, value]) => {
        datesObject[key].responses = {};
        forEach(responsesByUser[value.userAgent], ({ question, response }) => {
          datesObject[key].responses[question] = {
            value: response,
          };
        });
        delete datesObject[key].userAgent;
      });

      return datesObject;
    },
    table.feedbackResponse,
    _transacting
  );
}

module.exports = getFeedbackResultsWithTime;
