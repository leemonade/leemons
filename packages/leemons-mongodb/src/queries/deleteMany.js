const {
  addDeploymentIDToArrayOrObject,
} = require("./helpers/addDeploymentIDToArrayOrObject");

function deleteMany({ model, autoDeploymentID, autoRollback, ctx }) {
  return async function () {
    const [_conditions, ...args] = arguments;
    let conditions = _conditions;
    if (autoDeploymentID) {
      conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
    }
    let oldItems = await model.find(conditions).lean();
    let items = await model.deleteMany(conditions, ...args);

    if (autoRollback) {
      console.log("deleteMany rollback", oldItems);
    }

    return items;
  };
}

module.exports = { deleteMany };
