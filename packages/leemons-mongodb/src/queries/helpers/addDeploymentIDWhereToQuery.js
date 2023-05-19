const { getDeploymentIDFromCTX } = require("./getDeploymentIDFromCTX");

function addDeploymentIDWhereToQuery({ query, ctx }) {
  return query.where({ deploymentID: getDeploymentIDFromCTX({ ctx }) });
}

module.exports = { addDeploymentIDWhereToQuery };
