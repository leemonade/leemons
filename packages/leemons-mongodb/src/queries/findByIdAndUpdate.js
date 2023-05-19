const { findOneAndUpdate } = require("./findOneAndUpdate");

function findByIdAndUpdate({ model, autoDeploymentID, autoRollback, ctx }) {
  return async function () {
    const [id, ...args] = arguments;
    return findOneAndUpdate({ model, autoDeploymentID, autoRollback, ctx })(
      { _id: id },
      ...args
    );
  };
}

module.exports = { findByIdAndUpdate };
