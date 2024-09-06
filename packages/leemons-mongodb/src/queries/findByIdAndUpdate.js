const { findOneAndUpdate } = require('./findOneAndUpdate');

/**
 * @param {Object} props
 * @param {import('mongoose').Model} props.model
 * @param {string} props.modelKey
 * @param {boolean} props.autoDeploymentID
 * @param {boolean} props.autoTransaction
 * @param {boolean} props.autoRollback
 * @param {boolean} props.autoLRN
 * @param {boolean} props.ignoreTransaction
 * @param {import('moleculer').Context} props.ctx
 * @returns {import('../types').FindByIdAndUpdateQuery}
 */
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
  /**
   * @type {import('../types').FindByIdAndUpdateQuery}
   */
  return async function (id, ...args) {
    return findOneAndUpdate({
      model,
      modelKey,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ignoreTransaction,
      ctx,
    })({ id }, ...args);
  };
}

module.exports = { findByIdAndUpdate };
