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

function getModelActions({
  model,
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  ctx,
}) {
  return {
    save: save({ model, autoDeploymentID, autoTransaction, autoRollback, ctx }),
    create: create({
      model,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    find: find({ model, autoDeploymentID, autoTransaction, autoRollback, ctx }),
    findById: findById({
      model,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    findOne: findOne({
      model,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    findByIdAndDelete: findByIdAndDelete({
      model,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    findByIdAndRemove: findByIdAndDelete({
      model,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    findOneAndDelete: findOneAndDelete({
      model,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    findOneAndRemove: findOneAndDelete({
      model,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    findByIdAndUpdate: findByIdAndUpdate({
      model,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    findOneAndUpdate: findOneAndUpdate({
      model,
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
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    updateMany: updateMany({
      model,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    deleteOne: deleteOne({
      model,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    }),
    deleteMany: deleteMany({
      model,
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
  ctx,
}) {
  const db = {};
  _.forIn(models, (model, key) => {
    db[key] = getModelActions({
      model,
      autoDeploymentID,
      autoTransaction,
      autoRollback,
      ctx,
    });
  });
  return db;
}

module.exports = ({
  autoDeploymentID,
  autoTransaction,
  autoRollback,
  models,
}) => {
  return {
    name: "",
    mixins: [LeemonsDeploymentIDMixin],
    hooks: {
      before: {
        "*": [
          async function (ctx) {
            ctx.db = getDBModels({
              models,
              autoTransaction,
              autoDeploymentID,
              autoRollback,
              ctx,
            });
          },
        ],
      },
    },
  };
};
