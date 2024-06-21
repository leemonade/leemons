const { findOneAndDelete } = require('./findOneAndDelete');

/**
 * @param {Object} props
 * @param {import('mongoose').Model} props.model
 * @param {string} props.modelKey
 * @param {boolean} props.autoDeploymentID
 * @param {boolean} props.autoTransaction
 * @param {boolean} props.autoRollback
 * @param {boolean} props.ignoreTransaction
 * @param {import('moleculer').Context} props.ctx
 * @returns {import('../types').FindByIdAndDeleteQuery}
 */
function findByIdAndDelete({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ignoreTransaction,
  ctx,
}) {
  /**
   * @type {import('../types').FindByIdAndDeleteQuery}
   */
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
