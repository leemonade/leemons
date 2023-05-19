const { getDeploymentIDFromCTX } = require("leemons-deployment");

function addDeploymentIDWhereToQuery({ query, ctx }) {
  return query.where({ deploymentID: getDeploymentIDFromCTX(ctx) });
}

module.exports = { addDeploymentIDWhereToQuery };
