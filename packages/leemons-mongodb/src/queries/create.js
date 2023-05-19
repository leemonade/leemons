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
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ctx,
}) {
  return async function () {
    await createTransactionIDIfNeed({ autoTransaction, ctx });
    await increaseTransactionPendingIfNeed({ ctx });
    try {
      const [toAdd, ...args] = arguments;
      let toCreate = toAdd;
      if (autoDeploymentID)
        toCreate = addDeploymentIDToArrayOrObject({ items: toCreate, ctx });
      const items = await model.create(toCreate, ...args);
      if (ctx.meta.transactionID) {
        await addTransactionState(ctx, {
          action: "rollback",
          payload: {
            action: "removeMany",
            data: _.isArray(items) ? _.map(items, "_id") : [items._id],
          },
        });
      }
      return items;
    } finally {
      await increaseTransactionFinishedIfNeed({ ctx });
    }
  };
}

module.exports = { create };
