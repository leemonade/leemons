const {
  addDeploymentIDToArrayOrObject,
} = require("./helpers/addDeploymentIDToArrayOrObject");

function updateOne({ model, autoDeploymentID, autoRollback, ctx }) {
  return async function () {
    const [_conditions, _update, ...args] = arguments;
    let conditions = _conditions;
    let update = _update;
    if (autoDeploymentID) {
      conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
      update = addDeploymentIDToArrayOrObject({ items: update, ctx });
    }
    let oldItem = await model.findOne(conditions).lean();
    let item = await model.updateOne(conditions, update, ...args);

    if (autoRollback) {
      console.log("updateOne rollback", oldItem);
    }

    return item;
  };
}

module.exports = { updateOne };
