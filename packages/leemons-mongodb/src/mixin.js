const _ = require("lodash");
const { LeemonsDeploymentIDMixin } = require("leemons-deployment");
const { create } = require("./queries/create");
const { find } = require("./queries/find");
const { findById } = require("./queries/findById");
const { findOne } = require("./queries/findOne");
const { findOneAndDelete } = require("./queries/findOneAndDelete");
const { findByIdAndDelete } = require("./queries/findByIdAndDelete");
const { findOneAndUpdate } = require("./queries/findOneAndUpdate");
const { findByIdAndUpdate } = require("./queries/findByIdAndUpdate");
const { updateOne } = require("./queries/updateOne");
const { updateMany } = require("./queries/updateMany");
const { deleteOne } = require("./queries/deleteOne");
const { deleteMany } = require("./queries/deleteMany");
const { save } = require("./queries/save");
const {
  createTransactionIDIfNeed,
} = require("./queries/helpers/createTransactionIDIfNeed");
const { rollbackTransaction } = require("leemons-transactions");

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
      throw new Error("findOneAndReplace not implemented");
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

module.exports = ({
  waitToRollbackFinishOnError = true,
  autoDeploymentID = true,
  autoTransaction = true,
  autoRollback = true,
  debugTransaction = false,
  models,
}) => {
  return {
    name: "",
    mixins: [LeemonsDeploymentIDMixin],
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
              "[MongoDB Transactions] (Rollback) - " + ctx.params.action,
              ctx.params.data
            );
          }
          console.log(ctx.params);
          switch (ctx.params.action) {
            case "removeMany":
              await model.deleteMany({ _id: ctx.params.data });
              break;
            case "createMany":
              await model.create(ctx.params.data);
              break;
            case "updateMany":
              await Promise.all(
                _.map(ctx.params.data, (data) => {
                  return model.findOneAndUpdate({ _id: data._id }, data);
                })
              );
            default:
              throw new Error(
                `Error on MongoDB rollback: The action ${ctx.params.action} not found`
              );
          }
          return true;
        },
      },
    },
    hooks: {
      error: {
        "*": [
          async function (ctx, err) {
            if (autoRollback) {
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
        "*": [
          async function (ctx) {
            ctx.__call = ctx.call;
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
              return ctx.__call(actionName, params, opts);
            };
            ctx.tx = {
              call: async (actionName, params, opts) => {
                if (!opts?.meta?.__isInternalCall) {
                  await createTransactionIDIfNeed({ autoTransaction, ctx });
                } else if (
                  debugTransaction &&
                  actionName.startsWith("transactions.")
                ) {
                  console.debug(
                    "[MongoDB Transactions] (Call) - " +
                      actionName.replace("transactions.", ""),
                    params,
                    opts
                  );
                }
                return ctx.__call(actionName, params, opts);
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
          },
        ],
      },
    },
  };
};
