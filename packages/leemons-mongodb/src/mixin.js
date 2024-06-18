const _ = require('lodash');
const { rollbackTransaction } = require('@leemons/transactions');
const { LeemonsError } = require('@leemons/error');
const { ObjectId } = require('mongoose').Types;
const { getActionNameFromCTX } = require('@leemons/service-name-parser');
const { Query } = require('mongoose');
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

function tracingWrapper(f, modelParams) {
  const { ctx } = modelParams;

  return (...params) => {
    if (!ctx?.span) {
      return f(modelParams)(...params);
    }
    const span = ctx.broker.tracer.startSpan(`mongoose ${f.name}`, {
      parentSpan: ctx.span,
      service: 'mongoose',
      type: 'mongoose',
      tags: {
        model: modelParams.model.modelName,
        action: getActionNameFromCTX(ctx),
        method: f.name,
        params,
      },
    });

    const response = f(modelParams)(...params);

    // Check if is a mongoose query
    if (response instanceof Query) {
      // Logic to handle mongoose query object
      const oldExec = response.exec;
      response.exec = (op) =>
        oldExec
          .call(response, op)
          .then((res) => {
            span.finish();
            return res;
          })
          .catch((error) => {
            span.setError(error);
            span.finish();
            throw error;
          });

      return response;
    }

    return response
      .then((res) => {
        ctx.finishSpan(span);
        return res;
      })
      .catch((error) => {
        span.setError(error);
        ctx.finishSpan(span);
        throw error;
      });
  };
}

function getModelActions({
  model,
  modelKey,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  autoLRN,
  ignoreTransaction,
  ctx,
}) {
  return {
    save: tracingWrapper(save, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    create: tracingWrapper(create, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    find: tracingWrapper(find, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findById: tracingWrapper(findById, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findOne: tracingWrapper(findOne, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findByIdAndDelete: tracingWrapper(findByIdAndDelete, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findByIdAndRemove: tracingWrapper(findByIdAndDelete, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findOneAndDelete: tracingWrapper(findOneAndDelete, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findOneAndRemove: tracingWrapper(findOneAndDelete, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findByIdAndUpdate: tracingWrapper(findByIdAndUpdate, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findOneAndUpdate: tracingWrapper(findOneAndUpdate, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    findOneAndReplace: () => {
      throw new Error('findOneAndReplace not implemented');
    },
    updateOne: tracingWrapper(updateOne, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    updateMany: tracingWrapper(updateMany, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    deleteOne: tracingWrapper(deleteOne, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    deleteMany: tracingWrapper(deleteMany, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    countDocuments: tracingWrapper(countDocuments, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
    insertMany: tracingWrapper(insertMany, {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),

    aggregate: tracingWrapper(() => model.aggregate.bind(model), {
      model,
      modelKey,
      ignoreTransaction,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      autoLRN,
      ctx,
    }),
  };
}

function getDBModels({
  models,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  autoLRN,
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
      autoLRN,
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
    autoLRN,
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
  ctx.__leemonsMongoDBEmit = ctx.emit;
  ctx.db = getDBModels({
    models,
    autoTransaction,
    autoDeploymentID,
    autoRollback,
    autoLRN,
    ignoreTransaction: true,
    ctx,
  });
  ctx.call = (actionName, params, opts) => {
    if (!_.isObject(opts)) opts = {};
    if (!_.isObject(opts.meta)) opts.meta = {};
    opts.meta.transactionID = null;
    return ctx.__leemonsMongoDBCall(actionName, params, opts);
  };
  ctx.emit = (event, params) =>
    ctx.__leemonsMongoDBEmit(event, params, { meta: { transactionID: null } });

  ctx.tx = {
    emit: async (event, params) => {
      await createTransactionIDIfNeed({ autoTransaction, ctx });
      return ctx.__leemonsMongoDBEmit(event, params);
    },
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
      autoLRN,
      ignoreTransaction: false,
      ctx,
    }),
  };
}

const mixin = ({
  waitToRollbackFinishOnError = true,
  autoDeploymentID = true,
  autoTransaction = true,
  autoRollback = true,
  autoLRN = true,
  debugTransaction = false,
  forceLeemonsDeploymentManagerMixinNeedToBeImported = true,
  models,
} = {}) => ({
  name: '',
  metadata: {
    mixins: {
      LeemonsMongoDBMixin: true,
    },
    LeemonsMongoDBMixin: {
      models: ({ ctx, ...options }) =>
        getDBModels({
          ...options,
          ctx,
          models,
        }),
    },
  },
  actions: {
    leemonsMongoDBRollback: {
      async handler(ctx) {
        const model = ctx.db[ctx.params.modelKey];
        if (!model) {
          throw new Error(
            `Error on MongoDB rollback: The model "${ctx.params.modelKey}" not found in ctx.db`
          );
        }
        if (debugTransaction || process.env.DEBUG === 'true') {
          console.debug(
            `[MongoDB Transactions] (Rollback) - ${ctx.params.action}`,
            ctx.params.data
          );
        }

        switch (ctx.params.action) {
          case 'removeMany':
            await model.deleteMany({
              $or: [
                { id: ctx.params.data },
                { _id: _.filter(ctx.params.data, (id) => ObjectId.isValid(id)) },
              ],
            });
            break;
          case 'createMany':
            await model.create(ctx.params.data);
            break;
          case 'updateMany':
            await Promise.all(
              _.map(ctx.params.data, (data) => model.findOneAndUpdate({ id: data.id }, data))
            );
            break;
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
          if (!err.message?.includes?.('LeemonsMiddlewareAuthenticated')) {
            console.error('[MongoDB Hook Error] - ', err);
          }
          if (
            autoRollback &&
            ctx.meta.transactionID &&
            ctx.id === ctx.meta.transactionExecutionId
          ) {
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
            autoLRN,
            debugTransaction,
            forceLeemonsDeploymentManagerMixinNeedToBeImported,
            models,
          });
          let createTransaction = true;
          if (ctx.action?.name) {
            const action = this.originalSchema.actions?.[getActionNameFromCTX(ctx)];
            if (action?.dontCreateTransactionOnCallThisFunction) createTransaction = false;
          }
          if (createTransaction) await createTransactionIDIfNeed({ autoTransaction, ctx });
        },
      ],
    },
  },
  created() {
    _.forIn(this.events, (value, key) => {
      this.events[key] = async (params, opts, { afterModifyCTX } = {}) =>
        value(params, opts, {
          onError: async (ctx, err) => {
            console.error('[MongoDB Event Error] - ', err);
            if (
              autoRollback &&
              ctx.meta.transactionID &&
              ctx.id === ctx.meta.transactionExecutionId
            ) {
              if (waitToRollbackFinishOnError) {
                await rollbackTransaction(ctx);
              } else {
                rollbackTransaction(ctx);
              }
            }
          },
          afterModifyCTX: async (ctx) => {
            modifyCTX(ctx, {
              waitToRollbackFinishOnError,
              autoDeploymentID,
              autoTransaction,
              autoRollback,
              autoLRN,
              debugTransaction,
              forceLeemonsDeploymentManagerMixinNeedToBeImported,
              models,
            });
            await createTransactionIDIfNeed({ autoTransaction, ctx });
            if (_.isFunction(afterModifyCTX)) {
              await afterModifyCTX(ctx);
            }
          },
        });
      // Si forceLeemonsDeploymentManagerMixinNeedToBeImported es true estaremos llamando al evento de deployment-manager
      // y este una vez el configura el ctx llama a afterModifyCTX para que podamos configurar nuestro contexto de mongodb
      // En caso de que no sea un evento de deployment-manager no podremos acceder a ctx.db y ctx.tx en el evento
    });
  },
});

module.exports = {
  mixin,
  getModelActions,
  getDBModels,
  modifyCTX,
};
