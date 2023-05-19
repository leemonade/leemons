const {
  addDeploymentIDToArrayOrObject,
} = require("./helpers/addDeploymentIDToArrayOrObject");

function findOneAndUpdate({ model, autoDeploymentID, autoRollback, ctx }) {
  return async function () {
    const [_conditions, _update, ...args] = arguments;
    let conditions = _conditions;
    let update = _update;
    if (autoDeploymentID) {
      conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
      update = addDeploymentIDToArrayOrObject({ items: update, ctx });
    }
    let oldItem = null;
    if (args[0]?.new) {
      oldItem = await model.findOne(conditions).lean();
    }
    let item = await model.findOneAndUpdate(conditions, update, ...args);
    if (!args[0]?.new) {
      oldItem = item;
    }

    if (autoRollback) {
      console.log("findOneAndUpdate rollback", oldItem);
    }

    return item;
  };
}

module.exports = { findOneAndUpdate };
