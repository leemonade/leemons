const { addDeploymentIDWhereToQuery } = require('./helpers/addDeploymentIDWhereToQuery');
const { excludeDeleteIfNeedToQuery } = require('./helpers/excludeDeleteIfNeedToQuery');

function find({ model, autoDeploymentID, ctx }) {
  return function (conditions, projection, options) {
    const query = excludeDeleteIfNeedToQuery(model.find(conditions, projection, options), options);
    if (autoDeploymentID) return addDeploymentIDWhereToQuery({ query, ctx });
    return query;
  };
}

module.exports = { find };
