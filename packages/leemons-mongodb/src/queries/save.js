const { addDeploymentIDToArrayOrObject } = require('./helpers/addDeploymentIDToArrayOrObject');

function save({ model, autoDeploymentID, autoRollback, ctx }) {
  return async function (item) {
    throw new Error('Not implemented yet');
  };
}

module.exports = { save };
