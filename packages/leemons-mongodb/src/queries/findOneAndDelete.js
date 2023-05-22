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

function findOneAndDelete({
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
      const [_conditions, ...args] = arguments;
      let conditions = _conditions;
      if (autoDeploymentID)
        conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });

      let item = await model.findOneAndDelete(conditions, ...args);

      if (!ignoreTransaction && ctx.meta.transactionID && item) {
        await addTransactionState(ctx, {
          action: "leemonsMongoDBRollback",
          payload: {
            modelKey,
            action: "createMany",
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
