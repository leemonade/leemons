const { addTransactionState } = require('leemons-transactions');
const { generateLRN } = require('leemons-lrn');
const { ObjectId } = require('mongodb');
const _ = require('lodash');
const { addDeploymentIDToArrayOrObject } = require('./helpers/addDeploymentIDToArrayOrObject');
const { createTransactionIDIfNeed } = require('./helpers/createTransactionIDIfNeed');
const {
  increaseTransactionFinishedIfNeed,
} = require('./helpers/increaseTransactionFinishedIfNeed');
const { increaseTransactionPendingIfNeed } = require('./helpers/increaseTransactionPendingIfNeed');
const { getLRNConfig } = require('./helpers/getLRNConfig');

function updateMany({
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
      const [_conditions, _update, ...args] = arguments;
      let conditions = _conditions;
      let update = _update;
      if (autoDeploymentID) {
        conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
        update = addDeploymentIDToArrayOrObject({ items: update, ctx });
      }
      let oldItems = [];

      if (args[0]?.upsert) {
        if (autoLRN) {
          if (!_.isObject(update.$setOnInsert)) {
            update.$setOnInsert = {};
          }
          update.$setOnInsert.id = generateLRN({
            ...getLRNConfig({ modelKey, ctx }),
            resourceID: new ObjectId(),
          });
        }
      }

      if (!ignoreTransaction && ctx.meta.transactionID)
        oldItems = await model.find(conditions).lean();
      const items = await model.updateMany(conditions, update, ...args);

      if (!ignoreTransaction && ctx.meta.transactionID && oldItems?.length) {
        await addTransactionState(ctx, {
          action: 'leemonsMongoDBRollback',
          payload: {
            modelKey,
            action: 'updateMany',
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

module.exports = { updateMany };
