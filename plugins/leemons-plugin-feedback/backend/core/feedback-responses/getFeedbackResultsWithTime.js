const { forEach, groupBy, map } = require('lodash');

async function getFeedbackResultsWithTime({ instanceId, ctx }) {
  const feedbackDates = await ctx.tx.db.FeedbackDates.find({ instance: instanceId }).lean();

  const datesObject = {};
  forEach(feedbackDates, (feedbackDate) => {
    datesObject[feedbackDate.endDate || feedbackDate.startDate] = {
      userAgent: feedbackDate.userAgent,
    };
  });
  const userAgents = Object.values(datesObject).map((value) => value.userAgent);
  const userResponses = await ctx.tx.db.FeedbackResponse.find({
    instance: instanceId,
    userAgent: userAgents,
  }).lean();
  const responsesByUser = groupBy(
    map(userResponses, (value) => ({
      ...value,
      response: JSON.parse(value.response || null),
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
}

module.exports = getFeedbackResultsWithTime;
