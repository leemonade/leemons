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

function deleteMany({
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
      if (autoDeploymentID) {
        conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
      }
      let oldItems = [];
      if (!ignoreTransaction && ctx.meta.transactionID)
        oldItems = await model.find(conditions).lean();
      let items = await model.deleteMany(conditions, ...args);

      if (!ignoreTransaction && ctx.meta.transactionID && oldItems?.length) {
        await addTransactionState(ctx, {
          action: "leemonsMongoDBRollback",
          payload: {
            modelKey,
            action: "createMany",
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
