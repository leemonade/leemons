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
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ctx,
}) {
  return async function () {
    await createTransactionIDIfNeed({ autoTransaction, ctx });
    await increaseTransactionPendingIfNeed({ ctx });
    try {
      const [_conditions, ...args] = arguments;
      let conditions = _conditions;
      if (autoDeploymentID)
        conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });

      let item = await model.findOneAndDelete(conditions, ...args);

      if (ctx.meta.transactionID && item) {
        await addTransactionState(ctx, {
          action: "rollback",
          payload: {
            action: "createMany",
            data: [item],
          },
        });
      }

      return item;
    } finally {
      await increaseTransactionFinishedIfNeed({ ctx });
    }
  };
}

module.exports = { findOneAndDelete };
