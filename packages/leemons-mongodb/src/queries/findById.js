const { addDeploymentIDWhereToQuery } = require('./helpers/addDeploymentIDWhereToQuery');
const { excludeDeleteIfNeedToQuery } = require('./helpers/excludeDeleteIfNeedToQuery');

function findById({ model, autoDeploymentID, ctx }) {
  return function (id, projection, options) {
    const query = excludeDeleteIfNeedToQuery(model.findOne({ id }, projection, options), options);
    if (autoDeploymentID) return addDeploymentIDWhereToQuery({ query, ctx });
    return query;
  };
}

module.exports = { findById };
