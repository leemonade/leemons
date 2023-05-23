const { addTransactionState } = require("leemons-transactions");
const {
  addDeploymentIDToArrayOrObject,
} = require("./helpers/addDeploymentIDToArrayOrObject");
const {
  createTransactionIDIfNeed,
} = require("./helpers/createTransactionIDIfNeed");
const {
  increaseTransactionFinishedIfNeed,
} = require("./helpers/increaseTransactionFinishedIfNeed");
const {
  increaseTransactionPendingIfNeed,
} = require("./helpers/increaseTransactionPendingIfNeed");

function updateOne({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ignoreTransaction,
  ctx,
}) {
  return async function () {
    await createTransactionIDIfNeed({
      ignoreTransaction,
      autoTransaction,
      ctx,
    });
    await increaseTransactionPendingIfNeed({ ignoreTransaction, ctx });
    try {
      const [_conditions, _update, ...args] = arguments;
      let conditions = _conditions;
      let update = _update;
      if (autoDeploymentID) {
        conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
        update = addDeploymentIDToArrayOrObject({ items: update, ctx });
      }
      let oldItem = null;
      if (!ignoreTransaction && ctx.meta.transactionID)
        oldItem = await model.findOne(conditions).lean();
      let item = await model.updateOne(conditions, update, ...args);

      if (!ignoreTransaction && ctx.meta.transactionID && oldItem) {
        await addTransactionState(ctx, {
          action: "leemonsMongoDBRollback",
          payload: {
            modelKey,
            action: "updateMany",
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

module.exports = { updateOne };
