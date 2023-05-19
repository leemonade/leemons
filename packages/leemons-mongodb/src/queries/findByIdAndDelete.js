const { findOneAndDelete } = require("./findOneAndDelete");

function findByIdAndDelete({ model, autoDeploymentID, autoRollback, ctx }) {
  return async function () {
    const [id, ...args] = arguments;
    return findOneAndDelete({ model, autoDeploymentID, autoRollback, ctx })(
      { _id: id },
      ...args
    );
  };
}

module.exports = { findByIdAndDelete };
