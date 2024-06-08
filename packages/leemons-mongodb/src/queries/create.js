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
 *
 * @param {Object} props
 * @param {import('mongoose').Model} props.model
 * @param {string} props.modelKey
 * @param {boolean} props.autoDeploymentID
 * @param {boolean} props.autoTransaction
 * @param {boolean} props.autoRollback
 * @param {boolean} props.autoLRN
 * @param {boolean} props.ignoreTransaction
 * @param {import('moleculer').Context} props.ctx
 * @returns {import('../types').CreateQuery}
 */
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
  /**
   * @type {import('../types').CreateQuery}
   */
  return async function (toAdd, options) {
    await createTransactionIDIfNeed({
      ignoreTransaction,
      autoTransaction,
      ctx,
    });
    await increaseTransactionPendingIfNeed({ ignoreTransaction, ctx });
    try {
      let toCreate = toAdd;
      if (autoDeploymentID && !options?.disableAutoDeploy)
        toCreate = addDeploymentIDToArrayOrObject({ items: toCreate, ctx });
      if (autoLRN && !options?.disableAutoLRN)
        toCreate = addLRNToIdToArrayOrObject({ items: toCreate, modelKey, ctx });

      const { disableAutoDeploy, disableAutoLRN, ..._options } = options || {};

      const items = await model.create(
        toCreate,
        Object.keys(_options).length ? _options : undefined
      );

      if (!ignoreTransaction && ctx.meta.transactionID) {
        await addTransactionState(ctx, {
          action: 'leemonsMongoDBRollback',
          payload: {
            modelKey,
            action: 'removeMany',
            data: _.isArray(items) ? _.map(items, (item) => item.id) : [items.id],
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
