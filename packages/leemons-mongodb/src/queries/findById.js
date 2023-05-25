const { addDeploymentIDWhereToQuery } = require('./helpers/addDeploymentIdWhereToQuery');

function findById({ model, autoDeploymentID, ctx }) {
  return function (...args) {
    const query = model.findById(...args);
    if (autoDeploymentID) return addDeploymentIDWhereToQuery({ query, ctx });
    return query;
  };
}

module.exports = { findById };
