const { addTransactionState } = require('@leemons/transactions');
const { addDeploymentIDToArrayOrObject } = require('./helpers/addDeploymentIDToArrayOrObject');
const { createTransactionIDIfNeed } = require('./helpers/createTransactionIDIfNeed');
const {
  increaseTransactionFinishedIfNeed,
} = require('./helpers/increaseTransactionFinishedIfNeed');
const { increaseTransactionPendingIfNeed } = require('./helpers/increaseTransactionPendingIfNeed');
const { findOneAndUpdate } = require('./findOneAndUpdate');

/**
 * @param {Object} props
 * @param {import('mongoose').Model} props.model
 * @param {string} props.modelKey
 * @param {boolean} props.autoDeploymentID
 * @param {boolean} props.autoTransaction
 * @param {boolean} props.autoRollback
 * @param {boolean} props.ignoreTransaction
 * @param {import('moleculer').Context} props.ctx
 * @returns {import('../types').FindOneAndDeleteQuery}
 */
function findOneAndDelete({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ignoreTransaction,
  ctx,
}) {
  /**
   * @type {import('../types').FindOneAndDeleteQuery}
   */
  return async function (_conditions = {}, options) {
    if (options?.soft) {
      return findOneAndUpdate({
        model,
        modelKey,
        autoDeploymentID,
        autoTransaction,
        autoRollback,
        ignoreTransaction,
        ctx,
      })(_conditions, { isDeleted: true, deletedAt: new Date() }, options);
    }
    await createTransactionIDIfNeed({
      ignoreTransaction,
      autoTransaction,
      ctx,
    });
    await increaseTransactionPendingIfNeed({ ignoreTransaction, ctx });
    try {
      let conditions = _conditions;
      if (autoDeploymentID) conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });

      const item = await model.findOneAndDelete(conditions, options);

      if (!ignoreTransaction && ctx.meta.transactionID && item) {
        await addTransactionState(ctx, {
          action: 'leemonsMongoDBRollback',
          payload: {
            modelKey,
            action: 'createMany',
            data: [item],
          },
        });
      }

      return item;
    } finally {
      await increaseTransactionFinishedIfNeed({ ignoreTransaction, ctx });
    }
  };
}

module.exports = { findOneAndDelete };
