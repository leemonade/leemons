const _ = require('lodash');
const { rollbackTransaction } = require('leemons-transactions');
const { LeemonsError } = require('leemons-error');
const { create } = require('./queries/create');
const { find } = require('./queries/find');
const { findById } = require('./queries/findById');
const { findOne } = require('./queries/findOne');
const { findOneAndDelete } = require('./queries/findOneAndDelete');
const { findByIdAndDelete } = require('./queries/findByIdAndDelete');
const { findOneAndUpdate } = require('./queries/findOneAndUpdate');
const { findByIdAndUpdate } = require('./queries/findByIdAndUpdate');
const { updateOne } = require('./queries/updateOne');
const { updateMany } = require('./queries/updateMany');
const { deleteOne } = require('./queries/deleteOne');
const { deleteMany } = require('./queries/deleteMany');
const { countDocuments } = require('./queries/countDocuments');
const { save } = require('./queries/save');
const { createTransactionIDIfNeed } = require('./queries/helpers/createTransactionIDIfNeed');
const { insertMany } = require('./queries/insertMany');

function getModelActions({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ignoreTransaction,
  ctx,
}) {
  return {
    save: save({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    create: create({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    find: find({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    findById: findById({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    findOne: findOne({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    findByIdAndDelete: findByIdAndDelete({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    findByIdAndRemove: findByIdAndDelete({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    findOneAndDelete: findOneAndDelete({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    findOneAndRemove: findOneAndDelete({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    findByIdAndUpdate: findByIdAndUpdate({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    findOneAndUpdate: findOneAndUpdate({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    findOneAndReplace: () => {
      throw new Error('findOneAndReplace not implemented');
    },
    updateOne: updateOne({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    updateMany: updateMany({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    deleteOne: deleteOne({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    deleteMany: deleteMany({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    countDocuments: countDocuments({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    insertMany: insertMany({
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
  };
}

function getDBModels({
  models,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ignoreTransaction,
  ctx,
}) {
  const db = {};
  _.forIn(models, (model, key) => {
    db[key] = getModelActions({
      model,
      modelKey: key,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ignoreTransaction,
      ctx,
    });
  });
  return db;
}

function modifyCTX(
  ctx,
  {
    waitToRollbackFinishOnError,
    autoDeploymentID,
    autoTransaction,
    autoRollback,
    debugTransaction,
    forceLeemonsDeploymentManagerMixinNeedToBeImported,
    models,
  }
) {
  if (forceLeemonsDeploymentManagerMixinNeedToBeImported) {
    if (!ctx.meta.deploymentID || !ctx.callerPlugin || !ctx.__leemonsDeploymentManagerCall) {
      throw new LeemonsError(ctx, {
        message: 'LeemonsDeploymentManagerMixin need to be used',
      });
    }
  }
  ctx.__leemonsMongoDBCall = ctx.call;
  ctx.db = getDBModels({
    models,
    autoTransaction,
    autoDeploymentID,
    autoRollback,
    ignoreTransaction: true,
    ctx,
  });
  ctx.call = (actionName, params, opts) => {
    if (!_.isObject(opts)) opts = {};
    if (!_.isObject(opts.meta)) opts.meta = {};
    if (!opts.meta.transactionID) {
      opts.meta.transactionID = null;
    }
    return ctx.__leemonsMongoDBCall(actionName, params, opts);
  };
  ctx.tx = {
    call: async (actionName, params, opts) => {
      if (!opts?.meta?.__isInternalCall) {
        await createTransactionIDIfNeed({ autoTransaction, ctx });
      } else if (debugTransaction && actionName.startsWith('transactions.')) {
        console.debug(
          `[MongoDB Transactions] (Call) - ${actionName.replace('transactions.', '')}`,
          params,
          opts
        );
      }
      return ctx.__leemonsMongoDBCall(actionName, params, opts);
    },
    db: getDBModels({
      models,
      autoTransaction,
      autoDeploymentID,
      autoRollback,
      ignoreTransaction: false,
      ctx,
    }),
  };
}

module.exports = ({
  waitToRollbackFinishOnError = true,
  autoDeploymentID = true,
  autoTransaction = true,
  autoRollback = true,
  debugTransaction = false,
  forceLeemonsDeploymentManagerMixinNeedToBeImported = true,
  models,
}) => ({
  name: '',
  actions: {
    leemonsMongoDBRollback: {
      async handler(ctx) {
        const model = ctx.db[ctx.params.modelKey];
        if (!model) {
          throw new Error(
            `Error on MongoDB rollback: The model "${ctx.params.modelKey}" not found in ctx.db`
          );
        }
        if (debugTransaction) {
          console.debug(
            `[MongoDB Transactions] (Rollback) - ${ctx.params.action}`,
            ctx.params.data
          );
        }
        switch (ctx.params.action) {
          case 'removeMany':
            await model.deleteMany({ _id: ctx.params.data });
            break;
          case 'createMany':
            await model.create(ctx.params.data);
            break;
          case 'updateMany':
            await Promise.all(
              _.map(ctx.params.data, (data) => model.findOneAndUpdate({ _id: data._id }, data))
            );
          default:
            throw new Error(`Error on MongoDB rollback: The action ${ctx.params.action} not found`);
        }
        return true;
      },
    },
  },
  hooks: {
    error: {
      '*': [
        async function (ctx, err) {
          if (autoRollback && ctx.meta.transactionID) {
            if (waitToRollbackFinishOnError) {
              await rollbackTransaction(ctx);
            } else {
              rollbackTransaction(ctx);
            }
          }
          throw err;
        },
      ],
    },
    before: {
      '*': [
        async function (ctx) {
          modifyCTX(ctx, {
            waitToRollbackFinishOnError,
            autoDeploymentID,
            autoTransaction,
            autoRollback,
            debugTransaction,
            forceLeemonsDeploymentManagerMixinNeedToBeImported,
            models,
          });
        },
      ],
    },
  },
  created() {
    _.forIn(this.events, (value, key) => {
      this.events[key] = async (params, opts) =>
        // Si forceLeemonsDeploymentManagerMixinNeedToBeImported es true estaremos llamando al evento de deployment-manager
        // y este una vez el configura el ctx llama a afterModifyCTX para que podamos configurar nuestro contexto de mongodb
        // En caso de que no sea un evento de deployment-manager no podremos acceder a ctx.db y ctx.tx en el evento
        value(params, opts, {
          afterModifyCTX: (ctx) => {
            modifyCTX(ctx, {
              waitToRollbackFinishOnError,
              autoDeploymentID,
              autoTransaction,
              autoRollback,
              debugTransaction,
              forceLeemonsDeploymentManagerMixinNeedToBeImported,
              models,
            });
          },
        });
    });
  },
});
