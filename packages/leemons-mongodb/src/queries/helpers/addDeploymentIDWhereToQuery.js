const { getDeploymentIDFromCTX } = require('@leemons/deployment-manager');

function addDeploymentIDWhereToQuery({ query, ctx }) {
  return query.where({ deploymentID: getDeploymentIDFromCTX(ctx) });
}

module.exports = { addDeploymentIDWhereToQuery };
