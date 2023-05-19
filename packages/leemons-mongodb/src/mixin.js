const _ = require("lodash");
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

function getModelActions({ model, autoDeploymentID, autoRollback, ctx }) {
  return {
    save: save({ model, autoDeploymentID, autoRollback, ctx }),
    create: create({ model, autoDeploymentID, autoRollback, ctx }),
    find: find({ model, autoDeploymentID, autoRollback, ctx }),
    findById: findById({ model, autoDeploymentID, autoRollback, ctx }),
    findOne: findOne({ model, autoDeploymentID, autoRollback, ctx }),
    findByIdAndDelete: findByIdAndDelete({
      model,
      autoDeploymentID,
      autoRollback,
      ctx,
    }),
    findByIdAndRemove: findByIdAndDelete({
      model,
      autoDeploymentID,
      autoRollback,
      ctx,
    }),
    findOneAndDelete: findOneAndDelete({
      model,
      autoDeploymentID,
      autoRollback,
      ctx,
    }),
    findOneAndRemove: findOneAndDelete({
      model,
      autoDeploymentID,
      autoRollback,
      ctx,
    }),
    findByIdAndUpdate: findByIdAndUpdate({
      model,
      autoDeploymentID,
      autoRollback,
      ctx,
    }),
    findOneAndUpdate: findOneAndUpdate({
      model,
      autoDeploymentID,
      autoRollback,
      ctx,
    }),
    findOneAndReplace: () => {
      throw new Error("findOneAndReplace not implemented");
    },
    updateOne: updateOne({
      model,
      autoDeploymentID,
      autoRollback,
      ctx,
    }),
    updateMany: updateMany({
      model,
      autoDeploymentID,
      autoRollback,
      ctx,
    }),
    deleteOne: deleteOne({
      model,
      autoDeploymentID,
      autoRollback,
      ctx,
    }),
    deleteMany: deleteMany({
      model,
      autoDeploymentID,
      autoRollback,
      ctx,
    }),
  };
}

function getDBModels({ models, autoDeploymentID, autoRollback, ctx }) {
  const db = {};
  _.forIn(models, (model, key) => {
    db[key] = getModelActions({ model, autoDeploymentID, autoRollback, ctx });
  });
  return db;
}

module.exports = ({ autoDeploymentID, autoRollback, models }) => {
  return {
    name: "",
    hooks: {
      before: {
        "*": [
          async function (ctx) {
            ctx.db = getDBModels({
              models,
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
