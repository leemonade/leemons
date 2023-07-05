const _ = require('lodash');
const { addTransactionState } = require('leemons-transactions');
const { addDeploymentIDToArrayOrObject } = require('./helpers/addDeploymentIDToArrayOrObject');
const { createTransactionIDIfNeed } = require('./helpers/createTransactionIDIfNeed');
const { increaseTransactionPendingIfNeed } = require('./helpers/increaseTransactionPendingIfNeed');
const {
  increaseTransactionFinishedIfNeed,
} = require('./helpers/increaseTransactionFinishedIfNeed');
const { addLRNToIdToArrayOrObject } = require('./helpers/addLRNToIdToArrayOrObject');

function create({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  autoLRN,
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
      if (autoDeploymentID) toCreate = addDeploymentIDToArrayOrObject({ items: toCreate, ctx });
      if (autoLRN) toCreate = addLRNToIdToArrayOrObject({ items: toCreate, modelKey, ctx });
      const items = await model.create(toCreate, ...args);

      if (!ignoreTransaction && ctx.meta.transactionID) {
        await addTransactionState(ctx, {
          action: 'leemonsMongoDBRollback',
          payload: {
            modelKey,
            action: 'removeMany',
            data: _.isArray(items) ? _.map(items, 'id') : [items.id],
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
