const {
  addDeploymentIDWhereToQuery,
} = require("./helpers/addDeploymentIdWhereToQuery");

function find({ model, autoDeploymentID, ctx }) {
  return function () {
    const query = model.find(...arguments);
    if (autoDeploymentID) return addDeploymentIDWhereToQuery({ query, ctx });
    return query;
  };
}

module.exports = { find };
