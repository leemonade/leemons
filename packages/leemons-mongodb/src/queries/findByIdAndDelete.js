const { findOneAndDelete } = require('./findOneAndDelete');

function findByIdAndDelete({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ignoreTransaction,
  ctx,
}) {
  return async function (id, ...args) {
    return findOneAndDelete({
      model,
      modelKey,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ignoreTransaction,
      ctx,
    })({ id }, ...args);
  };
}

module.exports = { findByIdAndDelete };
