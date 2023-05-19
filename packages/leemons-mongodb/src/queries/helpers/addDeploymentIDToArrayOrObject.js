const _ = require("lodash");
const { getDeploymentIDFromCTX } = require("leemons-deployment");

function addDeploymentIDToArrayOrObject({ items, ctx }) {
  if (_.isArray(items)) {
    return _.map(items, (item) => {
      item.deploymentID = getDeploymentIDFromCTX(ctx);
      return item;
    });
  } else {
    items.deploymentID = getDeploymentIDFromCTX(ctx);
    return items;
  }
}

module.exports = { addDeploymentIDToArrayOrObject };
