/* eslint-disable no-param-reassign */
const _ = require('lodash');

async function findQuestionResponses({ query, columns, ctx }) {
  let responses = ctx.tx.db.UserAgentAssignableInstanceResponses.find(query);
  if (columns && columns.length) {
    responses = responses.select(columns);
  }
  responses = await responses.lean();
  return _.map(responses, (response) => {
    response.properties = JSON.parse(response.properties || null);
    return response;
  });
}

module.exports = { findQuestionResponses };
