const { addTransactionState } = require('@leemons/transactions');
const { addDeploymentIDToArrayOrObject } = require('./helpers/addDeploymentIDToArrayOrObject');
const { createTransactionIDIfNeed } = require('./helpers/createTransactionIDIfNeed');
const {
  increaseTransactionFinishedIfNeed,
} = require('./helpers/increaseTransactionFinishedIfNeed');
const { increaseTransactionPendingIfNeed } = require('./helpers/increaseTransactionPendingIfNeed');
const { updateMany } = require('./updateMany');

/**
 * @param {Object} props
 * @param {import('mongoose').Model} props.model
 * @param {string} props.modelKey
 * @param {boolean} props.autoDeploymentID
 * @param {boolean} props.autoTransaction
 * @param {boolean} props.autoRollback
 * @param {boolean} props.ignoreTransaction
 * @param {import('moleculer').Context} props.ctx
 * @returns {import('../types').DeleteManyQuery}
 */
function deleteMany({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ignoreTransaction,
  ctx,
}) {
  /**
   * @type {import('../types').DeleteManyQuery}
   */
  return async function (_conditions = {}, options = {}) {
    if (options?.soft) {
      return updateMany({
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
      if (autoDeploymentID) {
        conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
      }

      let oldItems = [];
      if (!ignoreTransaction && ctx.meta.transactionID)
        oldItems = await model.find(conditions).lean();
      const items = await model.deleteMany(conditions, options);

      if (!ignoreTransaction && ctx.meta.transactionID && oldItems?.length) {
        await addTransactionState(ctx, {
          action: 'leemonsMongoDBRollback',
          payload: {
            modelKey,
            action: 'createMany',
            data: oldItems,
          },
        });
      }

      return items;
    } finally {
      await increaseTransactionFinishedIfNeed({ ignoreTransaction, ctx });
    }
  };
}

module.exports = { deleteMany };
