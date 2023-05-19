const {
  addDeploymentIDToArrayOrObject,
} = require("./helpers/addDeploymentIDToArrayOrObject");

function findOneAndDelete({ model, autoDeploymentID, autoRollback, ctx }) {
  return async function () {
    const [_conditions, ...args] = arguments;
    let conditions = _conditions;
    if (autoDeploymentID)
      conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
    let item = await model.findOneAndDelete(conditions, ...args);

    if (autoRollback) {
      console.log("findOneAndDelete rollback", item);
    }

    return item;
  };
}

module.exports = { findOneAndDelete };
