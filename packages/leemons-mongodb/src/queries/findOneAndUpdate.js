const _ = require('lodash');
const { addTransactionState } = require('@leemons/transactions');
const { ObjectId } = require('mongodb');
const { generateLRN } = require('@leemons/lrn');
const { addDeploymentIDToArrayOrObject } = require('./helpers/addDeploymentIDToArrayOrObject');
const { createTransactionIDIfNeed } = require('./helpers/createTransactionIDIfNeed');
const {
  increaseTransactionFinishedIfNeed,
} = require('./helpers/increaseTransactionFinishedIfNeed');
const { increaseTransactionPendingIfNeed } = require('./helpers/increaseTransactionPendingIfNeed');
const { getLRNConfig } = require('./helpers/getLRNConfig');
const { excludeDeleteIfNeedToQuery } = require('./helpers/excludeDeleteIfNeedToQuery');

function findOneAndUpdate({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  autoLRN,
  ignoreTransaction,
  ctx,
}) {
  return async function (_conditions = {}, _update, _options) {
    await createTransactionIDIfNeed({
      ignoreTransaction,
      autoTransaction,
      ctx,
    });
    await increaseTransactionPendingIfNeed({ ignoreTransaction, ctx });
    try {
      let conditions = _conditions;
      let options = _options;
      let update = _update;

      if (!options) options = {};
      // eslint-disable-next-line no-prototype-builtins
      if (!options.hasOwnProperty('new')) {
        options.new = true;
      }
      if (autoDeploymentID) {
        conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
        update = addDeploymentIDToArrayOrObject({ items: update, ctx });
      }

      let oldItem = null;
      let rollbackAction = 'updateMany';
      // Si es upsert forzamos new a true para que siempre devuelva el elemento/creado actualizado
      // por que si no existe y se crea necesitamos saber que id es la que se a creado
      if (options?.upsert) {
        options.new = true;
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
      if (!ignoreTransaction && ctx.meta.transactionID && (options?.new || options?.upsert)) {
        oldItem = await excludeDeleteIfNeedToQuery(model.findOne(conditions).lean(), options);
      }
      const item = await excludeDeleteIfNeedToQuery(
        model.findOneAndUpdate(conditions, update, options),
        options
      );
      // Si es upsert y no encontramos elemento previo la accion del rollback deberia de ser borrar lo que se cree nuevo
      if (!oldItem && options?.upsert) {
        rollbackAction = 'removeMany';
        oldItem = item;
      }
      // Si upsert es false y new es false como nos devuelve el item antiguo lo almacenamos para el rollback
      if (!options?.new) {
        oldItem = item;
      }

      if (!ignoreTransaction && ctx.meta.transactionID && oldItem) {
        await addTransactionState(ctx, {
          action: 'leemonsMongoDBRollback',
          payload: {
            modelKey,
            action: rollbackAction,
            data: rollbackAction === 'removeMany' ? [oldItem.id] : [oldItem],
          },
        });
      }

      return item;
    } finally {
      await increaseTransactionFinishedIfNeed({ ignoreTransaction, ctx });
    }
  };
}

module.exports = { findOneAndUpdate };
