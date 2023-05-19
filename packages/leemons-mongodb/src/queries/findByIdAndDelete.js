const { findOneAndDelete } = require("./findOneAndDelete");

function findByIdAndDelete({
  model,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ctx,
}) {
  return async function () {
    const [id, ...args] = arguments;
    return findOneAndDelete({
      model,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    })({ _id: id }, ...args);
  };
}

module.exports = { findByIdAndDelete };
