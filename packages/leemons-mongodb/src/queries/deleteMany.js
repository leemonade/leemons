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

function deleteMany({
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
      if (autoDeploymentID) {
        conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
      }
      let oldItems = [];
      if (ctx.meta.transactionID)
        oldItems = await model.find(conditions).lean();
      let items = await model.deleteMany(conditions, ...args);

      if (ctx.meta.transactionID && oldItems?.length) {
        await addTransactionState(ctx, {
          action: "rollback",
          payload: {
            action: "createMany",
            data: oldItems,
          },
        });
      }

      return items;
    } finally {
      await increaseTransactionFinishedIfNeed({ ctx });
    }
  };
}

module.exports = { deleteMany };
