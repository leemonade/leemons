async function getUserAssignableResponses({ instanceId, ctx }) {
  const results = await ctx.tx.db.FeedbackResponse.find({
    instance: instanceId,
    userAgent: ctx.meta.userSession.userAgents[0].id,
  }).lean();

  const responses = {};
  results.forEach((result) => {
    responses[result.question] = JSON.parse(result.response || null);
  });

  return responses;
}

module.exports = getUserAssignableResponses;
