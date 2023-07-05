const { findOneAndUpdate } = require('./findOneAndUpdate');

function findByIdAndUpdate({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  autoLRN,
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
      autoLRN,
      ignoreTransaction,
      ctx,
    })({ id: }, ...args);
  };
}

module.exports = { findByIdAndUpdate };
