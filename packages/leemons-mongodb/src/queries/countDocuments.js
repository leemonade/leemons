const { addDeploymentIDToArrayOrObject } = require('./helpers/addDeploymentIDToArrayOrObject');
const { excludeDeleteIfNeedToQuery } = require('./helpers/excludeDeleteIfNeedToQuery');

function countDocuments({ model, autoDeploymentID, ctx }) {
  return function (_conditions = {}, options, ...args) {
    let conditions = _conditions;
    if (autoDeploymentID) conditions = addDeploymentIDToArrayOrObject({ items: conditions, ctx });
    return excludeDeleteIfNeedToQuery(model.countDocuments(conditions, options, ...args), options);
  };
}

module.exports = { countDocuments };
