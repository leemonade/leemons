/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');

async function findQuestionResponses(query, { columns, transacting } = {}) {
  const responses = await table.userAgentAssignableInstanceResponses.find(query, {
    columns,
    transacting,
  });
  return _.map(responses, (response) => {
    response.properties = JSON.parse(response.properties);
    return response;
  });
}

module.exports = { findQuestionResponses };
