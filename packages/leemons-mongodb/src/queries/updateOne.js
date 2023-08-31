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
const { excludeDeleteIfNeedToQuery } = require('./helpers/excludeDeleteIfNeedToQuery');

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
  return async function (_conditions = {}, _update = {}, options) {
    await createTransactionIDIfNeed({
      ignoreTransaction,
      autoTransaction,
      ctx,
    });
    await increaseTransactionPendingIfNeed({ ignoreTransaction, ctx });
    try {
      let conditions = _conditions;
      let update = _update;
      if (autoDeploymentID) {
        conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
        update = addDeploymentIDToArrayOrObject({ items: update, ctx });
      }
      let oldItem = null;
      let rollbackAction = 'updateMany';

      if (options?.upsert) {
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

      if (!ignoreTransaction && ctx.meta.transactionID && options?.upsert)
        oldItem = await excludeDeleteIfNeedToQuery(model.findOne(conditions).lean(), options);
      const item = await excludeDeleteIfNeedToQuery(
        model.updateOne(conditions, update, options),
        options
      );

      // Si es upsert y no encontramos elemento previo la accion del rollback deberia de ser borrar lo que se cree nuevo
      if (!oldItem && options?.upsert) {
        rollbackAction = 'removeMany';
        oldItem = item.upsertedId;
      }

      if (!ignoreTransaction && ctx.meta.transactionID && oldItem) {
        await addTransactionState(ctx, {
          action: 'leemonsMongoDBRollback',
          payload: {
            modelKey,
            action: rollbackAction,
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
