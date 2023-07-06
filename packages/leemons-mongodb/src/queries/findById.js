const { addDeploymentIDWhereToQuery } = require('./helpers/addDeploymentIdWhereToQuery');

function findById({ model, autoDeploymentID, ctx }) {
  return function (id, ...args) {
    const query = model.findOne({ id }, ...args);
    if (autoDeploymentID) return addDeploymentIDWhereToQuery({ query, ctx });
    return query;
  };
}

module.exports = { findById };
