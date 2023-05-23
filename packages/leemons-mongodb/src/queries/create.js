const {
  addDeploymentIDToArrayOrObject,
} = require("./helpers/addDeploymentIDToArrayOrObject");
const _ = require("lodash");
const {
  createTransactionIDIfNeed,
} = require("./helpers/createTransactionIDIfNeed");
const {
  increaseTransactionPendingIfNeed,
} = require("./helpers/increaseTransactionPendingIfNeed");
const {
  increaseTransactionFinishedIfNeed,
} = require("./helpers/increaseTransactionFinishedIfNeed");
const { addTransactionState } = require("leemons-transactions");

function create({
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
      const [toAdd, ...args] = arguments;
      let toCreate = toAdd;
      if (autoDeploymentID)
        toCreate = addDeploymentIDToArrayOrObject({ items: toCreate, ctx });
      const items = await model.create(toCreate, ...args);
      if (!ignoreTransaction && ctx.meta.transactionID) {
        await addTransactionState(ctx, {
          action: "leemonsMongoDBRollback",
          payload: {
            modelKey,
            action: "removeMany",
            data: _.isArray(items) ? _.map(items, "_id") : [items._id],
          },
        });
      }
      return items;
    } finally {
      await increaseTransactionFinishedIfNeed({ ignoreTransaction, ctx });
    }
  };
}

module.exports = { create };
