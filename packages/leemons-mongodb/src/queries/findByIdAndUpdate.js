const { findOneAndUpdate } = require("./findOneAndUpdate");

function findByIdAndUpdate({
  model,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ctx,
}) {
  return async function () {
    const [id, ...args] = arguments;
    return findOneAndUpdate({
      model,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    })({ _id: id }, ...args);
  };
}

module.exports = { findByIdAndUpdate };
