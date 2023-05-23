const { findOneAndUpdate } = require("./findOneAndUpdate");

function findByIdAndUpdate({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ignoreTransaction,
  ctx,
}) {
  return async function () {
    const [id, ...args] = arguments;
    return findOneAndUpdate({
      model,
      modelKey,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ignoreTransaction,
      ctx,
    })({ _id: id }, ...args);
  };
}

module.exports = { findByIdAndUpdate };
