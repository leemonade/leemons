const { addDeploymentIDWhereToQuery } = require('./helpers/addDeploymentIdWhereToQuery');

function findOne({ model, autoDeploymentID, ctx }) {
  return function () {
    const query = model.findOne(...arguments);
    if (autoDeploymentID) return addDeploymentIDWhereToQuery({ query, ctx });
    return query;
  };
}

module.exports = { findOne };
