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
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ctx,
}) {
  return async function () {
    await createTransactionIDIfNeed({ autoTransaction, ctx });
    await increaseTransactionPendingIfNeed({ ctx });
    try {
      const [_conditions, _update, ...args] = arguments;
      let conditions = _conditions;
      let update = _update;
      if (autoDeploymentID) {
        conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
        update = addDeploymentIDToArrayOrObject({ items: update, ctx });
      }
      let oldItem = null;
      if (ctx.meta.transactionID)
        oldItem = await model.findOne(conditions).lean();
      let item = await model.updateOne(conditions, update, ...args);

      if (ctx.meta.transactionID && oldItem) {
        await addTransactionState(ctx, {
          action: "rollback",
          payload: {
            action: "updateOne",
            data: oldItem,
          },
        });
      }

      return item;
    } finally {
      await increaseTransactionFinishedIfNeed({ ctx });
    }
  };
}

module.exports = { updateOne };
