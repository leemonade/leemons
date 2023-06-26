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

function updateOne({
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
      let oldItem = null;

      if (args[0]?.upsert) {
        if (autoLRN) {
          if (!_.isObject(update.$setOnInsert)) {
            update.$setOnInsert = {};
          }
          update.$setOnInsert._id = generateLRN({
            ...getLRNConfig({ modelKey, ctx }),
            resourceID: new ObjectId(),
          });
        }
      }

      if (!ignoreTransaction && ctx.meta.transactionID)
        oldItem = await model.findOne(conditions).lean();
      const item = await model.updateOne(conditions, update, ...args);

      if (!ignoreTransaction && ctx.meta.transactionID && oldItem) {
        await addTransactionState(ctx, {
          action: 'leemonsMongoDBRollback',
          payload: {
            modelKey,
            action: 'updateMany',
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
