const { addTransactionState } = require('leemons-transactions');
const { addDeploymentIDToArrayOrObject } = require('./helpers/addDeploymentIDToArrayOrObject');
const { createTransactionIDIfNeed } = require('./helpers/createTransactionIDIfNeed');
const {
  increaseTransactionFinishedIfNeed,
} = require('./helpers/increaseTransactionFinishedIfNeed');
const { increaseTransactionPendingIfNeed } = require('./helpers/increaseTransactionPendingIfNeed');
const { updateOne } = require('./updateOne');

function deleteOne({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ignoreTransaction,
  ctx,
}) {
  return async function (_conditions = {}, options = {}) {
    if (options?.soft) {
      return updateOne({
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
      let oldItem = null;
      if (!ignoreTransaction && ctx.meta.transactionID)
        oldItem = await model.findOne(conditions).lean();
      const item = await model.deleteOne(conditions, options);

      if (!ignoreTransaction && ctx.meta.transactionID && oldItem) {
        await addTransactionState(ctx, {
          action: 'leemonsMongoDBRollback',
          payload: {
            modelKey,
            action: 'createMany',
            data: [oldItem],
          },
        });
      }

      return item;
    } finally {
      await increaseTransactionFinishedIfNeed({ ignoreTransaction, ctx });
    }
  };
}

module.exports = { deleteOne };
