const {
  addDeploymentIDToArrayOrObject,
} = require("./helpers/addDeploymentIDToArrayOrObject");

function updateMany({ model, autoDeploymentID, autoRollback, ctx }) {
  return async function () {
    const [_conditions, _update, ...args] = arguments;
    let conditions = _conditions;
    let update = _update;
    if (autoDeploymentID) {
      conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
      update = addDeploymentIDToArrayOrObject({ items: update, ctx });
    }
    let oldItems = await model.find(conditions).lean();
    let items = await model.updateMany(conditions, update, ...args);

    if (autoRollback) {
      console.log("updateMany rollback", oldItems);
    }

    return items;
  };
}

module.exports = { updateMany };
