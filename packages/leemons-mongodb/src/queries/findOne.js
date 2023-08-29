const { addDeploymentIDWhereToQuery } = require('./helpers/addDeploymentIDWhereToQuery');
const { excludeDeleteIfNeedToQuery } = require('./helpers/excludeDeleteIfNeedToQuery');

function findOne({ model, autoDeploymentID, ctx }) {
  return function (conditions = {}, projection, options) {
    const query = excludeDeleteIfNeedToQuery(
      model.findOne(conditions, projection, options),
      options
    );
    if (autoDeploymentID) return addDeploymentIDWhereToQuery({ query, ctx });
    return query;
  };
}

module.exports = { findOne };
