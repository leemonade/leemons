const {
  addDeploymentIDToArrayOrObject,
} = require("./helpers/addDeploymentIDToArrayOrObject");

function deleteOne({ model, autoDeploymentID, autoRollback, ctx }) {
  return async function () {
    const [_conditions, ...args] = arguments;
    let conditions = _conditions;
    if (autoDeploymentID) {
      conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
    }
    let oldItem = await model.findOne(conditions).lean();
    let item = await model.deleteOne(conditions, ...args);

    if (autoRollback) {
      console.log("deleteOne rollback", oldItem);
    }

    return item;
  };
}

module.exports = { deleteOne };
