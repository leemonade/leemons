const {
  addDeploymentIDToArrayOrObject,
} = require("./helpers/addDeploymentIDToArrayOrObject");
const _ = require("lodash");

function create({ model, autoDeploymentID, autoRollback, ctx }) {
  return async function () {
    const [toAdd, ...args] = arguments;
    let toCreate = toAdd;
    if (autoDeploymentID)
      toCreate = addDeploymentIDToArrayOrObject({ items: toCreate, ctx });
    const items = await model.create(toCreate, ...args);
    if (autoRollback) {
      console.log("create rollback", items);
      ctx.meta.transaction = await ctx.call("transactions.new");
      ctx.call("transactions.add", {
        action: "rollback",
        payload: {
          action: "removeMany",
          data: _.isArray(items) ? _.map(items, "_id") : [items._id],
        },
      });
    }
    return items;
  };
}

module.exports = { create };
