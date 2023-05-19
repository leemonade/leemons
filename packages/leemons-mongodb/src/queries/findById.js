const {
  addDeploymentIDWhereToQuery,
} = require("./helpers/addDeploymentIdWhereToQuery");

function findById({ model, autoDeploymentID, ctx }) {
  return function () {
    const query = model.findById(...arguments);
    if (autoDeploymentID) return addDeploymentIDWhereToQuery({ query, ctx });
    return query;
  };
}

module.exports = { findById };
