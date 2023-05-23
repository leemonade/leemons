const {
  addDeploymentIDToArrayOrObject,
} = require("./helpers/addDeploymentIDToArrayOrObject");

function countDocuments({ model, autoDeploymentID, ctx }) {
  return function () {
    const [_conditions, ...args] = arguments;
    let conditions = _conditions;
    if (autoDeploymentID)
      conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
    return model.countDocuments(conditions, ...args);
  };
}

module.exports = { countDocuments };
