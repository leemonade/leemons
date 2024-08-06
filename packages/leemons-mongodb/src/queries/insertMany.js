const _ = require('lodash');
const { addTransactionState } = require('@leemons/transactions');
const { addDeploymentIDToArrayOrObject } = require('./helpers/addDeploymentIDToArrayOrObject');
const { createTransactionIDIfNeed } = require('./helpers/createTransactionIDIfNeed');
const { increaseTransactionPendingIfNeed } = require('./helpers/increaseTransactionPendingIfNeed');
const {
  increaseTransactionFinishedIfNeed,
} = require('./helpers/increaseTransactionFinishedIfNeed');
const { addLRNToIdToArrayOrObject } = require('./helpers/addLRNToIdToArrayOrObject');

/**
 * @param {Object} props
 * @param {import('mongoose').Model} props.model
 * @param {string} props.modelKey
 * @param {boolean} props.autoDeploymentID
 * @param {boolean} props.autoTransaction
 * @param {boolean} props.autoRollback
 * @param {boolean} props.autoLRN
 * @param {boolean} props.ignoreTransaction
 * @param {import('moleculer').Context} props.ctx
 * @returns {import('../types').InsertManyQuery}
 */
function insertMany({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  autoLRN,
  ignoreTransaction,
  ctx,
}) {
  /**
   * @type {import('../types').InsertManyQuery}
   */
  return async function (toAdd, ...args) {
    await createTransactionIDIfNeed({
      ignoreTransaction,
      autoTransaction,
      ctx,
    });
    await increaseTransactionPendingIfNeed({ ignoreTransaction, ctx });
    try {
      let toCreate = toAdd;
      if (autoDeploymentID) toCreate = addDeploymentIDToArrayOrObject({ items: toCreate, ctx });
      if (autoLRN) toCreate = addLRNToIdToArrayOrObject({ items: toCreate, modelKey, ctx });
      let items = [];
      try {
        items = await model.insertMany(toCreate, ...args);
      } catch (e) {
        if (e.insertedDocs) {
          items = e.insertedDocs;
        }
        throw e;
      } finally {
        if (!ignoreTransaction && ctx.meta.transactionID && items.length) {
          await addTransactionState(ctx, {
            action: 'leemonsMongoDBRollback',
            payload: {
              modelKey,
              action: 'removeMany',
              data: _.isArray(items) ? _.map(items, 'id') : [items.id],
            },
          });
        }
      }

      return items;
    } finally {
      await increaseTransactionFinishedIfNeed({ ignoreTransaction, ctx });
    }
  };
}

module.exports = { insertMany };
